
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function Boilerplate() {
  const navigate = useNavigate();
  const { colors } = useTheme();

  // Store fetch templates here instead of importing
  const [templates, setTemplates] = useState({});
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    category: "Button",
    baseTemplate: "Button",
    variant: "Normal"
  });

  const [loading, setLoading] = useState(false);

  // Fetch Base Templates from DB
  useEffect(() => {
    api.get('/components')
      .then(res => {
        if (res.data.success) {
          const dbComponents = res.data.components;
          const builtTemplates = {};

          dbComponents.forEach(comp => {
            // We need to reconstruct the Category -> Variant structure
            // Strategy: Use the DB 'category'. 
            // Deduce 'variant' from name (e.g., "Normal Button" -> "Normal")
            // If logic fails, default to "Standard"
            const cat = comp.category;
            if (!builtTemplates[cat]) builtTemplates[cat] = {};

            let variant = "Normal";
            if (comp.name.includes("Animated")) variant = "Animated";
            if (comp.name.includes("AdminChoice")) variant = "AdminChoice";

            builtTemplates[cat][variant] = comp.definition;
          });

          setTemplates(builtTemplates);

          // Set initial defaults if available
          const firstCat = Object.keys(builtTemplates)[0];
          if (firstCat) {
            setFormData(prev => ({
              ...prev,
              category: firstCat,
              baseTemplate: firstCat
            }));
          }
        }
      })
      .catch(err => console.error("Failed to fetch templates", err))
      .finally(() => setLoadingTemplates(false));
  }, []);

  // Available templates to choose code from (Dynamic Keys)
  const templateKeys = Object.keys(templates);

  // Auto-generate name when template/variant changes
  useEffect(() => {
    if (!formData.name || formData.name.includes("Normal") || formData.name.includes("Animated")) {
      setFormData(prev => ({
        ...prev,
        name: `${prev.variant} ${prev.baseTemplate}`
      }));
    }
  }, [formData.baseTemplate, formData.variant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedTemplate = templates[formData.baseTemplate]?.[formData.variant];

      if (!selectedTemplate) {
        alert("Template not found in Database");
        setLoading(false);
        return;
      }

      const payload = {
        name: formData.name,
        category: formData.category,
        code: "",
        definition: selectedTemplate
      };

      const res = await api.post("/components", payload);
      navigate(`/editor/${res.data.component._id}`);
    } catch (err) {
      console.error("Failed to create boilerplate", err);
      alert("Error creating component: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loadingTemplates) {
    return <div style={{ padding: "40px", color: colors.text }}>Loading templates from system...</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", color: colors.text }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>Boilerplate Factory 🏭</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Generate a component. Based on system templates, but fully customizable.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

          {/* Base Template Selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: 600 }}>Base Template (DB)</label>
            <select
              value={`${formData.baseTemplate}:::${formData.variant}`}
              onChange={e => {
                const [newBase, newVar] = e.target.value.split(":::");
                setFormData(prev => ({
                  ...prev,
                  baseTemplate: newBase,
                  variant: newVar,
                  category: prev.category === prev.baseTemplate ? newBase : prev.category
                }));
              }}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: `1px solid ${colors.border}`,
                fontSize: "1rem",
                background: "white",
                cursor: "pointer"
              }}
            >
              {templateKeys.length === 0 && <option>No templates found</option>}
              {templateKeys.map(cat =>
                Object.keys(templates[cat]).map(vart => (
                  <option key={`${cat}:::${vart}`} value={`${cat}:::${vart}`}>
                    {cat} - {vart}
                  </option>
                ))
              )}
            </select>
            <small style={{ color: "#888", fontSize: "0.8rem" }}>Loaded from System DB ({Object.values(templates).reduce((acc, c) => acc + Object.keys(c).length, 0)} available)</small>
          </div>
        </div>


        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Component Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: 600 }}>Component Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ padding: "12px", borderRadius: "8px", border: `1px solid ${colors.border}`, fontSize: "1rem" }}
            />
          </div>

          {/* Target Category (Editable) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: 600 }}>Category (Tag)</label>
            <input
              type="text"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              required
              placeholder="e.g. Layouts"
              style={{ padding: "12px", borderRadius: "8px", border: `1px solid ${colors.border}`, fontSize: "1rem" }}
            />
          </div>
        </div>

        {/* Preview Box */}
        <div style={{ padding: "15px", background: "#f7fafc", borderRadius: "8px", border: "1px solid #edf2f7" }}>
          <strong style={{ display: "block", marginBottom: "5px", fontSize: "0.9em", color: "#4a5568" }}>Template Preview:</strong>
          <div style={{ display: "flex", gap: "20px", fontSize: "0.85em", color: "#4a5568" }}>
            <div>Source: <b>{formData.baseTemplate}</b> ({formData.variant})</div>
            <div>Markup Size: {templates[formData.baseTemplate]?.[formData.variant]?.markup?.length || 0} chars</div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "10px",
            padding: "15px",
            borderRadius: "8px",
            background: colors.primary,
            color: "white",
            border: "none",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "background 0.2s"
          }}
        >
          {loading ? "Creating..." : "🚀 Generate Component"}
        </button>

      </form>
    </div>
  );
}
