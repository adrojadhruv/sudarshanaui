import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import { useTheme } from "../context/ThemeContext";
import PreviewFrame from "../components/PreviewFrame";
import api from "../services/api";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Editor({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isCollabMode = queryParams.get("mode") === "collab";
  const isReviewMode = queryParams.get("mode") === "review";
  const requestId = queryParams.get("requestId");

  const { mode } = useTheme();
  // Map our 'mode' (light/dark) to Monaco's theme names ('vs', 'vs-dark')
  const editorTheme = mode === 'dark' ? 'vs-dark' : 'light';

  // --- STATE ---
  const [component, setComponent] = useState(null);
  const [definition, setDefinition] = useState("");
  const [lastValid, setLastValid] = useState({});
  const [jsonError, setJsonError] = useState(null);
  const [versions, setVersions] = useState([]);
  const [previewVersion, setPreviewVersion] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isCodeMode, setIsCodeMode] = useState(false);

  // DB Driven Templates State
  const [dbTemplates, setDbTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("All");

  // --- ACCESS CONTROL FLAGS ---
  const isBasicUser = user?.role === "user" || !user; // Guests treated as basic users (read-only)
  const isAdmin = user?.role === "admin";
  const isVerified = user?.role === "verifieduser";
  const userId = user?.id || user?._id; // Handle both login response (_id) and session response (id)

  // Can view code? Yes, everyone can view code now (ReadOnly for basic)
  const showCodeEditor = true;

  // Is ReadOnly?
  const isReadOnly = previewVersion || isReviewMode || (!isCollabMode && component?.status === "approved" && !isAdmin) || (!isCollabMode && isBasicUser && !isAdmin);

  // --- HELPERS ---
  const loadDefinition = (def) => {
    if (def && def.code) {
      setIsCodeMode(true);
      setDefinition(def.code);
      setLastValid(def);
    } else {
      setIsCodeMode(false);
      setDefinition(JSON.stringify(def, null, 2));
      setLastValid(def);
    }
  };

  // --- EFFECTS ---

  // 1. Fetch Component & Versions on Mount AND Fetch Templates
  useEffect(() => {
    if (!id) return;

    // Fetch Component
    api.get(`/components/${id}`)
      .then(async (res) => {
        const comp = res.data.component;
        setComponent(comp);

        // If Review Mode, fetch the proposal
        if (isReviewMode && requestId) {
          try {
            const reqRes = await api.get(`/collab/requests/${requestId}`);
            if (reqRes.data && reqRes.data.proposal) {
              loadDefinition(reqRes.data.proposal);
            }
          } catch (e) {
            console.error("Failed to load proposal", e);
            alert("Failed to load proposal details");
          }
        } else {
          // Normal Load
          loadDefinition(comp.definition);
        }

        // Fetch Versions
        return api.get(`/components/${id}/versions`);
      })
      .then(res => res && setVersions(res.data.versions))
      .catch(err => {
        console.error("Failed to load component", err);
      });

    // Fetch All Public/Approved Components to use as Templates
    api.get('/components')
      .then(res => {
        if (res.data.success) {
          setDbTemplates(res.data.components);
        }
      })
      .catch(err => console.error("Failed to fetch templates", err));

  }, [id, isReviewMode, requestId]);

  // UseEffect for validation (kept same)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!definition) return;

      if (isCodeMode) {
        // In Code Mode, definition IS the code string.
        // We wrap it back into the object structure for the preview/backend.
        // We preserve tags if we have them in component state, otherwise empty.
        const wrapped = {
          code: definition,
          tags: component?.definition?.tags || ["custom"]
        };
        setLastValid(wrapped);
        setJsonError(null);
        return;
      }

      try {
        const parsed = JSON.parse(definition);
        setLastValid(parsed);
        setJsonError(null);
      } catch (err) {
        setJsonError(err.message);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [definition, isCodeMode, component]);

  // ... (Handlers kept same)
  // ... (keeping handleFetchVersion, handleSave etc...)

  const handleFetchVersion = async (versionId) => {
    try {
      const res = await api.get(`/versions/${versionId}`);
      if (res.data.success) {
        loadDefinition(res.data.version.definition);
        setPreviewVersion(res.data.version);
      }
    } catch (err) {
      alert("Failed to fetch version details");
    }
  };

  const handleRevertToCurrent = () => {
    if (!component) return;
    loadDefinition(component.definition);
    setPreviewVersion(null);
  };

  const handleSave = async () => {
    if (jsonError) return alert("Invalid JSON");
    try {
      await api.put(`/components/${component._id}`, { definition: lastValid });
      alert("Saved successfully!");
    } catch (err) {
      alert("Save failed");
    }
  };

  const handleSubmit = async () => {
    if (!window.confirm("Submit for approval?")) return;
    try {
      await api.post(`/components/${component._id}/submit`);
      window.location.reload();
    } catch (err) {
      alert("Failed to submit");
    }
  };

  const handleApprove = async () => {
    if (!window.confirm("Approve component?")) return;
    try {
      await api.post(`/components/${component._id}/approve`);
      window.location.reload();
    } catch (err) {
      alert("Failed to approve");
    }
  };

  const handleReject = async () => {
    if (!window.confirm("Reject component?")) return;
    try {
      await api.post(`/components/${component._id}/reject`);
      window.location.reload();
    } catch (err) {
      alert("Failed to reject");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Discard this version? If no previous version exists, the component will be deleted.")) return;
    try {
      const res = await api.post(`/components/${component._id}/revert`);
      if (res.data.deleted) {
        alert("Component deleted (No previous version found)");
        navigate('/');
      } else {
        alert("Reverted to previous approved version");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to discard version");
    }
  };

  const handleCreateVersion = async () => {
    if (!window.confirm("Create new version from current approved state?")) return;

    // Prompt for custom version
    const customVersion = prompt("Enter new version number (e.g. 2.0.0)\nOr leave blank to auto-increment patch (1.0.x)", "");

    try {
      await api.post(`/components/${component._id}/version`, { customVersion });
      window.location.reload();
    } catch (err) {
      alert("Failed to create version: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDownload = async () => {
    try {
      const res = await api.get(`/components/${component._id}/package`);
      const { files } = res.data;
      const zip = new JSZip();
      Object.keys(files).forEach(f => zip.file(f, files[f]));
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${component.name}-package.zip`);
    } catch (err) {
      alert("Download failed");
    }
  };

  const handleProposeChange = async () => {
    if (jsonError) return alert("Invalid JSON");
    if (!window.confirm("Submit this proposal to the owner?")) return;
    try {
      await api.post("/collab/request", {
        componentId: component._id,
        baseVersion: component.version,
        proposal: lastValid
      });
      alert("Proposal submitted successfully!");
      navigate('/');
    } catch (err) {
      alert("Failed to submit proposal: " + (err.response?.data?.message || err.message));
    }
  };

  // --- MODE SWITCHING ---
  const handleSwitchToCodeMode = () => {
    if (isCodeMode) return;
    if (!window.confirm("Switch to Code Mode? This will convert your editor to a React Code editor. You can write full React components.")) return;

    const codeTemplate = `import React, { useState } from 'react';

export default function ${component.name.replace(/[^a-zA-Z0-9]/g, '')}(props) {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Hello Code Mode!</h2>
      <p>You can now write standard React code here.</p>
    </div>
  );
}`;

    setIsCodeMode(true);
    setDefinition(codeTemplate);
    // Update lastValid immediately so preview updates (wrapped for valid structure)
    setLastValid({ code: codeTemplate, tags: ["custom"] });
  };

  const handleSwitchToJsonMode = () => {
    if (!isCodeMode) return;
    if (!window.confirm("Default to JSON Mode? WARNING: This will DISCARD your current React code and reset to a basic JSON template.")) return;

    const jsonTemplate = {
      markup: "<div style={{padding: '20px'}}>Hello JSON Mode</div>",
      styles: {
        "div": { color: "#333" }
      },
      defaultProps: {}
    };

    setIsCodeMode(false);
    setDefinition(JSON.stringify(jsonTemplate, null, 2));
    setLastValid(jsonTemplate);
  };

  if (!component) return <div style={{ padding: 20 }}>Loading Editor...</div>;

  // Render logic part 1
  return (
    <div style={{ display: "flex", gap: "20px", height: "calc(100vh - 100px)", minHeight: "600px" }}>

      {/* LEFT COLUMN */}
      {showCodeEditor && (
        <div style={{ width: isCodeMode ? "100%" : "50%", display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Component Header... (Reusing existing UI code implicitly by skipping edits here if possible, but replace_content needs contiguous block. 
               This block is getting gigantic. I should have used multi_replace or smaller chunks. 
               I'll try to match the EXACT structure of existing file to minimize diff, but inserting the DB fetch logic.)
           */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "5px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h2 style={{ margin: 0, fontSize: "1.5rem", display: "flex", alignItems: "baseline" }}>
                {component.name}
                <span style={{ fontSize: '0.5em', marginLeft: 10, color: '#666', fontWeight: "normal" }}>
                  {previewVersion ? `Viewing v${previewVersion.version}` : `Current v${component.version}`}
                </span>
                {isCodeMode && (
                  <span style={{
                    fontSize: '0.4em', marginLeft: 10, background: '#2b6cb0', color: 'white',
                    padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px'
                  }}>
                    Code Mode
                  </span>
                )}
                {isCollabMode && (
                  <span style={{
                    fontSize: '0.4em', marginLeft: 10, background: '#8b5cf6', color: 'white',
                    padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px'
                  }}>
                    Proposing Change
                  </span>
                )}
                {isReviewMode && (
                  <span style={{
                    fontSize: '0.4em', marginLeft: 10, background: '#f59e0b', color: 'black',
                    padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px'
                  }}>
                    Reviewing Proposal
                  </span>
                )}
              </h2>
              {previewVersion && (
                <button
                  onClick={handleRevertToCurrent}
                  style={{ background: '#4a5568', color: 'white', border: 'none', padding: '6px 12px', fontSize: '0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Back to Current
                </button>
              )}
            </div>

            {/* AUTHOR & COLLABORATORS METADATA */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px", margin: "8px 0 12px", paddingBottom: "12px", borderBottom: "1px solid #e2e8f0" }}>
              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.75rem", color: "#718096", fontWeight: "600", textTransform: "uppercase" }}>
                  {previewVersion ? "Version Author" : "Author"}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f7fafc", padding: "4px 8px 4px 4px", borderRadius: "100px", border: "1px solid #edf2f7" }}>
                  <img
                    src={((previewVersion && previewVersion.author) ? previewVersion.author.avatar : component.owner?.avatar) || `https://ui-avatars.com/api/?name=${((previewVersion && previewVersion.author) ? previewVersion.author.name : component.owner?.name) || "A"}&background=random`}
                    style={{ width: "20px", height: "20px", borderRadius: "50%" }}
                    alt="Author"
                  />
                  <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#2d3748" }}>
                    {((previewVersion && previewVersion.author)
                      ? (previewVersion.author.role === "admin" ? "Admin" : previewVersion.author.name)
                      : (component.owner?.role === "admin" ? "Admin" : component.owner?.name)
                    ) || "Unknown"}
                  </span>
                </div>
              </div>

              {/* Collaborators */}
              {((previewVersion ? previewVersion.collaborators : component.collaborators) || []).length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "1px", height: "20px", background: "#cbd5e0" }}></div>
                  <span style={{ fontSize: "0.75rem", color: "#718096", fontWeight: "600", textTransform: "uppercase" }}>Collaborators</span>
                  <div style={{ display: "flex" }}>
                    {(previewVersion ? previewVersion.collaborators : component.collaborators).map((collab, i) => (
                      <img
                        key={i}
                        src={collab.avatar || `https://ui-avatars.com/api/?name=${collab.name || "C"}&background=random`}
                        title={collab.name}
                        style={{
                          width: "24px", height: "24px", borderRadius: "50%",
                          border: "2px solid white", marginLeft: "-8px", zIndex: 10 - i,
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* LIFECYCLE TIMELINE */}
            <div style={{ display: "flex", gap: "5px", alignItems: "center", fontSize: "0.75rem", fontWeight: "600", color: "#888", marginTop: "5px" }}>
              {['draft', 'pending', 'approved', 'versioned'].map((step, idx, arr) => {
                let isActive = false;
                if (component.status === step) isActive = true;
                if (step === 'versioned' && (previewVersion || (component.status === 'approved' && versions.length > 0))) isActive = false;

                const isCurrent = component.status === step || (step === 'versioned' && previewVersion != null);

                let color = "#cbd5e0";
                if (component.status === step) color = "#3182ce";
                if (component.status === 'approved' && step === 'approved') color = "#38a169";
                if (component.status === 'rejected' && step === 'pending') color = "#e53e3e";

                const label = step.charAt(0).toUpperCase() + step.slice(1);
                const displayLabel = (component.status === 'rejected' && step === 'pending') ? 'Rejected' : label;
                const displayColor = (component.status === 'rejected' && step === 'pending') ? '#e53e3e' : color;

                return (
                  <div key={step} style={{ display: "flex", alignItems: "center" }}>
                    <span style={{
                      color: displayColor,
                      borderBottom: component.status === step ? `2px solid ${displayColor}` : "none",
                      paddingBottom: "2px",
                      opacity: component.status === step ? 1 : 0.5
                    }}>
                      {displayLabel}
                    </span>
                    {idx < arr.length - 1 && <span style={{ margin: "0 8px", color: "#e2e8f0" }}>→</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* HELP & TEMPLATES TOGGLE */}
          <div style={{ marginBottom: "10px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <button
              onClick={() => setShowGuide(!showGuide)}
              style={{
                background: "none", border: "none", color: "#4299e1", fontSize: "0.85rem", cursor: "pointer", padding: 0, textDecoration: "underline"
              }}
            >
              {showGuide ? "Hide Schema Guide" : "Show Schema Guide"}
            </button>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              style={{
                background: "none", border: "none", color: "#ed8936", fontSize: "0.85rem", cursor: "pointer", padding: 0, textDecoration: "underline"
              }}
            >
              {showTemplates ? "Hide Templates (DB)" : "Load Templates (DB)"}
            </button>

            {/* MODE SWITCHER (Verified/Admin/Owner only if writable) */}
            {!isReadOnly && (
              isCodeMode ? (
                <button
                  onClick={handleSwitchToJsonMode}
                  style={{
                    background: "none", border: "none", color: "#e53e3e", fontSize: "0.85rem", cursor: "pointer", padding: 0, textDecoration: "underline", marginLeft: "auto"
                  }}
                >
                  Switch to JSON Mode
                </button>
              ) : (
                <button
                  onClick={handleSwitchToCodeMode}
                  style={{
                    background: "none", border: "none", color: "#805ad5", fontSize: "0.85rem", cursor: "pointer", padding: 0, textDecoration: "underline", marginLeft: "auto", fontWeight: "bold"
                  }}
                >
                  ⚡ Switch to Code Mode
                </button>
              )
            )}
          </div>

          {showGuide && (
            <div style={{
              marginBottom: "10px", padding: "10px", background: "#f7fafc", borderRadius: "6px", border: "1px solid #edf2f7", fontSize: "0.85rem", color: "#2d3748"
            }}>
              <strong>JSON Structure:</strong>
              <ul style={{ paddingLeft: "20px", margin: "5px 0" }}>
                <li><code>markup</code>: HTML string. Use <code>{`{{propName}}`}</code> for variables.</li>
                <li><code>styles</code>: Object. Keys are selectors. Standard CSS properties allowed.</li>
                <li><code>defaultProps</code>: Default values for variables.</li>
              </ul>
              <strong>Available CSS Tokens (Theme):</strong>
              <ul style={{ paddingLeft: "20px", margin: "5px 0" }}>
                <li><code>standard css</code>: All standard CSS properties are valid.</li>
                <li><code>root variables</code>: None enforced yet, but you can use standard colors.</li>
              </ul>
            </div>
          )}

          {showTemplates && (
            <div style={{
              marginBottom: "10px", padding: "10px", background: "#fff5f5", borderRadius: "6px", border: "1px solid #fed7d7", fontSize: "0.9rem", color: "#2d3748"
            }}>
              <strong>Select Boilerplate from Database:</strong>

              <div style={{ marginTop: "10px" }}>
                {!dbTemplates.length ? (
                  <div>Loading templates from public components...</div>
                ) : (
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: 'flex-start' }}>

                    {/* 1. Select Category */}
                    <div style={{ flex: 1, minWidth: '120px' }}>
                      <label style={{ display: 'block', fontSize: '0.75em', marginBottom: '4px', fontWeight: '600' }}>1. Category</label>
                      <select
                        value={selectedCategory}
                        onChange={e => {
                          setSelectedCategory(e.target.value);
                          // Reset component selection when category changes
                          document.getElementById('dbTemplateSelect').value = "";
                        }}
                        style={{ padding: "8px", borderRadius: "4px", width: '100%', border: "1px solid #cbd5e0" }}
                      >
                        <option value="">-- All --</option>
                        {[...new Set(dbTemplates.map(t => t.category))].sort().map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* 2. Select Component Type/Variant (Simulated from Name) */}
                    <div style={{ flex: 1, minWidth: '120px' }}>
                      <label style={{ display: 'block', fontSize: '0.75em', marginBottom: '4px', fontWeight: '600' }}>2. Type</label>
                      <select
                        value={selectedVariant}
                        onChange={e => {
                          setSelectedVariant(e.target.value);
                          document.getElementById('dbTemplateSelect').value = "";
                        }}
                        style={{ padding: "8px", borderRadius: "4px", width: '100%', border: "1px solid #cbd5e0" }}
                      >
                        <option value="All">All Types</option>
                        <option value="Normal">Normal</option>
                        <option value="Animated">Animated</option>
                      </select>
                    </div>

                    {/* 3. Select Component */}
                    <div style={{ flex: 2, minWidth: '200px' }}>
                      <label style={{ display: 'block', fontSize: '0.75em', marginBottom: '4px', fontWeight: '600' }}>3. Component</label>
                      <select
                        id="dbTemplateSelect"
                        style={{ padding: "8px", borderRadius: "4px", width: '100%', border: "1px solid #cbd5e0" }}
                      >
                        <option value="">-- Select Template --</option>
                        {dbTemplates
                          .filter(t => !selectedCategory || t.category === selectedCategory)
                          .filter(t => {
                            if (selectedVariant === "All") return true;
                            if (selectedVariant === "Normal") return !t.name.includes("Animated");
                            if (selectedVariant === "Animated") return t.name.includes("Animated");
                            return true;
                          })
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map(t => (
                            <option key={t._id} value={t._id}>{t.name}</option>
                          ))
                        }
                      </select>
                    </div>

                    {/* 3. Load Button */}
                    <button
                      onClick={() => {
                        const id = document.getElementById('dbTemplateSelect').value;
                        const t = dbTemplates.find(x => x._id === id);
                        if (t && window.confirm(`Overwrite current code with ${t.name}?`)) {
                          loadDefinition(t.definition);
                        }
                      }}
                      style={{ background: "#e53e3e", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", marginTop: '18px' }}
                    >
                      Load Template
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
            <MonacoEditor
              height="100%"
              language={isCodeMode ? "javascript" : "json"}
              theme={editorTheme}
              value={definition}
              onChange={(value) => !isReadOnly && setDefinition(value)}
              options={{
                readOnly: isReadOnly,
                minimap: { enabled: false }, // Cleaner look for smaller areas
                scrollBeyondLastLine: false,
                fontSize: 14,
                fontFamily: "'Fira Code', monospace",
                wordWrap: "on",
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
            {jsonError && (
              <div style={{ color: "white", background: "#e53e3e", padding: "8px 12px", fontSize: "0.85em", fontWeight: "bool" }}>
                Error: {jsonError}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: 'center' }}>
            {/* SAVE: Visible only to Verified Users (Owner) or Admins. MUST be Draft or Rejected (Not Approved). */}
            {!isReadOnly && (!isCollabMode && (isAdmin || !previewVersion)) && component.status !== 'approved' && (
              <button onClick={handleSave} style={{ padding: "8px 20px", background: "#2b6cb0", color: "white", border: "none", borderRadius: "6px" }}>Save</button>
            )}

            {/* PROPOSE CHANGE: Only in Collab Mode */}
            {isCollabMode && (
              <button onClick={handleProposeChange} style={{ padding: "8px 20px", background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold" }}>Submit Proposal</button>
            )}

            {/* SUBMIT / DELETE: Owner + Draft/Rejected OR Admin + Draft/Rejected */}
            {(isAdmin || String(component.owner?._id) === String(userId)) && (component.status === 'draft' || component.status === 'rejected') && (
              <>
                <button onClick={handleSubmit} style={{ padding: "8px 20px", background: "#3182ce", color: "white", border: "none", borderRadius: "6px" }}>Submit</button>
                <button onClick={handleDelete} style={{ padding: "8px 20px", background: "#e53e3e", color: "white", border: "none", borderRadius: "6px" }}>Delete</button>
              </>
            )}

            {/* APPROVE / REJECT: Admin + Pending */}
            {isAdmin && component.status === 'pending' && (
              <>
                <button onClick={handleApprove} style={{ padding: "8px 20px", background: "#38a169", color: "white", border: "none", borderRadius: "6px" }}>Approve</button>
                <button onClick={handleReject} style={{ padding: "8px 20px", background: "#e53e3e", color: "white", border: "none", borderRadius: "6px" }}>Reject</button>
              </>
            )}

            {/* CREATE VERSION: Verified Owner or Admin + Approved */}
            {
              (isAdmin ||
                (user?.id === component.owner?._id || user?._id === component.owner?._id || user?.id === component.owner || user?._id === component.owner) ||
                (String(component.owner?._id) === String(userId))
              ) && component.status === 'approved' && !previewVersion && (
                <button onClick={handleCreateVersion} style={{ padding: "8px 20px", background: "#805ad5", color: "white", border: "none", borderRadius: "6px" }}>Create Version</button>
              )}

            <button onClick={() => navigate('/')} style={{ padding: "8px 20px", background: "#718096", color: "white", border: "none", borderRadius: "6px" }}>Back</button>

            {/* DOWNLOAD BUTTON (Moved from Preview pane) */}
            <button onClick={handleDownload} style={{ padding: "8px 20px", background: "#ed8936", color: "white", border: "none", borderRadius: "6px", fontWeight: 600 }}>
              Download
            </button>
          </div>

          {/* HISTORY LIST */}
          <div style={{ borderTop: "1px solid #eee", paddingTop: "15px", marginTop: "5px" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#4a5568" }}>Version History</h4>
            {versions.length === 0 && <p style={{ color: '#a0aec0', fontSize: '0.9em' }}>No previous versions recorded.</p>}
            <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: "150px", overflowY: "auto" }}>
              {versions.map(v => (
                <li key={v._id}
                  style={{
                    padding: "8px 12px",
                    marginBottom: "4px",
                    background: previewVersion?._id === v._id ? "#ebf8ff" : "transparent",
                    color: previewVersion?._id === v._id ? "#2b6cb0" : "inherit",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.9em",
                    transition: "background 0.2s"
                  }}
                  onClick={() => handleFetchVersion(v._id)}
                  onMouseEnter={(e) => e.target.style.background = "#f7fafc"}
                  onMouseLeave={(e) => e.target.style.background = previewVersion?._id === v._id ? "#ebf8ff" : "transparent"}
                >
                  <span style={{ fontWeight: 500 }}>v{v.version}</span>
                  <span style={{ color: '#718096', fontSize: '0.85em' }}>{new Date(v.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )
      }

      {/* RIGHT COLUMN: PREVIEW (Hidden in Code Mode) */}
      {!isCodeMode && (
        <div style={{ width: showCodeEditor ? "50%" : "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "5px" }}>
            <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#4a5568" }}>Preview</h3>
            <button onClick={handleDownload} style={{ padding: "8px 16px", background: "#ed8936", color: "white", border: "none", borderRadius: "6px", cursor: 'pointer', fontWeight: 600, fontSize: "0.9rem" }}>
              Download Package
            </button>
          </div>

          <div style={{
            flex: 1,
            border: "1px solid #cbd5e0",
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: "#fff",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
          }}>
            <PreviewFrame definition={lastValid} />
          </div>
        </div>
      )}

    </div >
  );
}
