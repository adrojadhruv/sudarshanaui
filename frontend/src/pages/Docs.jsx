import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion, useScroll, useTransform } from 'framer-motion';

// --- ICONS (Minimalist & Formal) ---
const Icons = {
    System: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>,
    User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    Verified: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>,
    Admin: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" /><path d="M12 12 2.1 12" /><path d="M12 2v20" /></svg>,
    Package: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16.5 9.4 7.5 4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
    Download: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
    Code: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
};

export default function Docs() {
    const { colors, mode } = useTheme();
    const isDark = mode === 'dark';
    const { scrollYProgress } = useScroll();
    const [activeHash, setActiveHash] = useState('#overview');

    const SECTIONS = [
        { id: 'overview', title: 'System Overview' },
        { id: 'roles', title: 'Roles & Permissions' },
        { id: 'consumption', title: 'Consumption Strategies' },
        { id: 'studio', title: 'Code Editor' },
        { id: 'collaboration', title: 'Collaboration' },
    ];

    // Scroll Spy Logic
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveHash(`#${entry.target.id}`);
                }
            });
        }, { rootMargin: '-20% 0px -60% 0px' });

        SECTIONS.forEach(sec => {
            const el = document.getElementById(sec.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [SECTIONS]);

    // Styles
    const bg = isDark ? '#09090b' : '#ffffff';
    const textPrimary = isDark ? '#fafafa' : '#09090b';
    const textSecondary = isDark ? '#a1a1aa' : '#52525b';
    const border = isDark ? '1px solid #27272a' : '1px solid #e4e4e7';
    const accent = '#6366f1'; // Indigo

    return (
        <div style={{ background: bg, minHeight: '100vh', color: textPrimary, fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* READING PROGRESS BAR */}
            <motion.div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', background: accent, scaleX: scrollYProgress, transformOrigin: '0%', zIndex: 100 }} />

            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex' }}>

                {/* SIDEBAR NAVIGATION */}
                <nav style={{
                    width: '280px', height: '100vh', position: 'sticky', top: 0,
                    padding: '60px 40px', borderRight: border, display: 'flex', flexDirection: 'column'
                }}>
                    <div style={{ marginBottom: '60px' }}>
                        <h1 style={{ fontSize: '1rem', fontWeight: '700', letterSpacing: '-0.02em', margin: 0 }}>SUDARSHANA UI </h1>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {SECTIONS.map((item) => (
                            <a
                                key={item.id} href={`#${item.id}`}
                                style={{
                                    textDecoration: 'none',
                                    fontSize: '0.9rem',
                                    color: activeHash === `#${item.id}` ? textPrimary : textSecondary,
                                    fontWeight: activeHash === `#${item.id}` ? '600' : '400',
                                    paddingLeft: '12px',
                                    borderLeft: activeHash === `#${item.id}` ? `2px solid ${accent}` : '2px solid transparent',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {item.title}
                            </a>
                        ))}
                    </div>
                </nav>

                {/* MAIN CONTENT */}
                <main style={{ flex: 1, padding: '100px 80px', position: 'relative', overflow: 'hidden' }}>
                    {/* Background Image */}
                    <img
                        src="/documentation.png"
                        alt=""
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: '600px',
                            maxWidth: '50vw',
                            opacity: 0.5,
                            zIndex: 0,
                            pointerEvents: 'none'
                        }}
                    />

                    <div style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>

                        {/* OVERVIEW */}
                        <Section id="overview" isLast={false}>
                            <Header title="System Overview" isDark={isDark} />
                            <Paragraph isDark={isDark}>
                                Sudarshana UI is a <strong>Managed Component Ecosystem</strong>. Unlike static libraries, our platform treats components as living entities, continuously validated and synchronized to ensure pixel-perfect consistency across all applications.
                            </Paragraph>
                            <Paragraph isDark={isDark}>
                                Our centralized verification engine guarantees that every component you consume—whether via NPM or direct download—is production-ready, accessible, and optimized for modern React workflows.
                            </Paragraph>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '40px' }}>
                                <Metric label="Components" value="15+" border={border} isDark={isDark} />
                                <Metric label="Reliability" value="100%" border={border} isDark={isDark} />
                                <Metric label="Updates" value="Weekly" border={border} isDark={isDark} />
                            </div>
                        </Section>

                        {/* ROLES */}
                        <Section id="roles" isLast={false}>
                            <Header title="Roles & Permissions" isDark={isDark} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: isDark ? '#27272a' : '#e4e4e7', border: border, borderRadius: '8px', overflow: 'hidden' }}>
                                <RoleRow
                                    icon={Icons.User} title="User" type="Explorer" perm="Read Only" bg={bg} isDark={isDark}
                                    desc="Can browse gallery, view code, download assets. No strict DB access."
                                />
                                <RoleRow
                                    icon={Icons.Verified} title="Verified User" type="Architect" perm="Write Access" bg={bg} isDark={isDark}
                                    desc="Can create components, edit schemas, propose changes to the Forge."
                                />
                                <RoleRow
                                    icon={Icons.Admin} title="Admin" type="Governor" perm="Full Control" bg={bg} isDark={isDark}
                                    desc="Approves submissions. Manually triggers 'Semi-Automatic' Sync commands."
                                />
                            </div>
                        </Section>

                        {/* CONSUMPTION */}
                        <Section id="consumption" isLast={false}>
                            <Header title="Consumption Strategies" isDark={isDark} />
                            <Paragraph isDark={isDark}>The system supports two distinct integration patterns tailored to ownership requirements.</Paragraph>

                            <div style={{ marginTop: '40px', display: 'grid', gap: '32px' }}>

                                {/* METHOD A */}
                                <div style={{ padding: '32px', border: border, borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ padding: '8px', background: isDark ? '#27272a' : '#f4f4f5', borderRadius: '6px' }}><Icons.Package /></div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Method A: The Monolith (Managed)</h3>
                                    </div>
                                    <Paragraph isDark={isDark}>
                                        Install the full verified library via NPM. Ideal for staying in sync with the design system.
                                        Updates follow a <strong>Semi-Automatic</strong> flow: Users Request → Admins Approve → System Publishes.
                                    </Paragraph>
                                    <CodeBlock code="npm install @sudarshanaui/ui" isDark={isDark} />
                                </div>

                                {/* METHOD B */}
                                <div style={{ padding: '32px', border: border, borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ padding: '8px', background: isDark ? '#27272a' : '#f4f4f5', borderRadius: '6px' }}><Icons.Download /></div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Method B: The Atom (Unmanaged)</h3>
                                    </div>
                                    <Paragraph isDark={isDark}>
                                        Download individual components ("Ejecting"). You receive a standalone ZIP containing the raw source code and CSS.
                                        This grants <strong>100% Ownership</strong> of that specific component version.
                                    </Paragraph>
                                    <div style={{ display: 'flex', gap: '24px', fontSize: '0.9rem', color: textSecondary, fontFamily: 'monospace', marginTop: '16px', padding: '16px', background: isDark ? '#000' : '#f9f9f9', borderRadius: '6px' }}>
                                        <div>src/Component.jsx</div>
                                        <div>src/Component.css</div>
                                        <div>package.json</div>
                                    </div>
                                </div>

                                {/* METHOD C */}
                                <div style={{ padding: '32px', border: border, borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ padding: '8px', background: isDark ? '#27272a' : '#f4f4f5', borderRadius: '6px' }}><Icons.Code /></div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Method C: The Component (Selective)</h3>
                                    </div>
                                    <Paragraph isDark={isDark}>
                                        Install specific components as isolated packages. Ideal for keeping your bundle size minimal while retaining managed updates.
                                    </Paragraph>
                                    <CodeBlock code="npm i @sudarshanaui/component-name" isDark={isDark} />
                                </div>

                            </div>
                        </Section>

                        {/* STUDIO */}
                        <Section id="studio" isLast={false}>
                            <Header title="Code Editor" isDark={isDark} />
                            <Paragraph isDark={isDark}>The creation environment is split into two specialized modes.</Paragraph>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
                                <FeatureCard title="Design Mode" sub="JSON Schema" isDark={isDark} border={border}>
                                    Strict separation of Markup and Style. This structure is required for the Forge Auto-Compiler.
                                </FeatureCard>
                                <FeatureCard title="Code Mode" sub="React Payload" isDark={isDark} border={border}>
                                    Free-form coding playground. Use this to prototype complex logic and hooks before schemas are locked.
                                </FeatureCard>
                            </div>

                            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <Badge label="Live Preview" isDark={isDark} />
                                <Badge label="Versioning (v1.x)" isDark={isDark} />
                                <Badge label="Template Cloning" isDark={isDark} />
                                <Badge label="Asset Manager" isDark={isDark} />
                            </div>
                        </Section>

                        {/* COLLABORATION */}
                        <Section id="collaboration" isLast={true}>
                            <Header title="Collaboration" isDark={isDark} />
                            <Paragraph isDark={isDark}>
                                Growth is driven by our "Symbiosis" workflow. Contributions are tracked and rewarded.
                            </Paragraph>

                            <div style={{ marginTop: '30px', paddingLeft: '24px', borderLeft: `2px solid ${isDark ? '#27272a' : '#e4e4e7'}` }}>
                                <Step n="01" title="Proposal" desc="Edit any component in Collab Mode without affecting production." isDark={isDark} />
                                <Step n="02" title="Submission" desc="Submit diffs for review." isDark={isDark} />
                                <Step n="03" title="Merge" desc="Owner approval merges code and credits you as a contributor." isDark={isDark} />
                            </div>
                        </Section>
                    </div>
                </main>
            </div >
        </div >
    );
}

// --- COMPONENTS ---

const Section = ({ id, children, isLast }) => (
    <section id={id} style={{ marginBottom: isLast ? 0 : '120px', scrollMarginTop: '120px' }}>
        {children}
    </section>
);

const Header = ({ title, isDark }) => (
    <h2 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.03em', marginBottom: '24px', color: isDark ? '#fff' : '#000' }}>
        {title}
    </h2>
);

const Paragraph = ({ children, isDark }) => (
    <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: isDark ? '#a1a1aa' : '#52525b', marginBottom: '20px' }}>
        {children}
    </p>
);

const Metric = ({ label, value, border, isDark }) => (
    <div style={{ padding: '20px', border: border, borderRadius: '8px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: isDark ? '#fff' : '#000' }}>{value}</div>
        <div style={{ fontSize: '0.8rem', color: isDark ? '#71717a' : '#a1a1aa', marginTop: '4px' }}>{label}</div>
    </div>
);

const RoleRow = ({ icon: Icon, title, type, perm, desc, bg, isDark }) => (
    <div style={{ padding: '24px', background: bg, display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div style={{ color: isDark ? '#fafafa' : '#18181b' }}><Icon /></div>
        <div style={{ maxWidth: '180px' }}>
            <div style={{ fontWeight: '600', color: isDark ? '#fff' : '#000' }}>{title}</div>
            <div style={{ fontSize: '0.8rem', color: isDark ? '#a1a1aa' : '#71717a' }}>{type}</div>
        </div>
        <div style={{ flex: 1, fontSize: '0.95rem', color: isDark ? '#a1a1aa' : '#52525b' }}>{desc}</div>
        <div style={{ fontSize: '0.75rem', fontWeight: '600', padding: '4px 10px', background: isDark ? '#27272a' : '#f4f4f5', borderRadius: '100px', color: isDark ? '#d4d4d8' : '#52525b' }}>{perm}</div>
    </div>
);

const CodeBlock = ({ code, isDark }) => (
    <div style={{ padding: '16px', background: '#09090b', borderRadius: '6px', border: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <code style={{ fontFamily: 'monospace', color: '#fff' }}>{code}</code>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
    </div>
);

const FeatureCard = ({ title, sub, children, border, isDark }) => (
    <div style={{ padding: '24px', border: border, borderRadius: '8px' }}>
        <div style={{ fontWeight: '600', marginBottom: '4px', color: isDark ? '#fff' : '#000' }}>{title}</div>
        <div style={{ fontSize: '0.8rem', color: '#6366f1', marginBottom: '12px', fontWeight: '500' }}>{sub}</div>
        <p style={{ margin: 0, fontSize: '0.9rem', color: isDark ? '#a1a1aa' : '#52525b', lineHeight: '1.6' }}>{children}</p>
    </div>
);

const Badge = ({ label, isDark }) => (
    <span style={{ fontSize: '0.8rem', padding: '6px 12px', borderRadius: '100px', background: isDark ? '#27272a' : '#f4f4f5', color: isDark ? '#d4d4d8' : '#52525b', fontWeight: '500' }}>
        {label}
    </span>
);

const Step = ({ n, title, desc, isDark }) => (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#6366f1', paddingTop: '2px' }}>{n}</div>
        <div>
            <div style={{ fontWeight: '600', color: isDark ? '#fff' : '#000', marginBottom: '4px' }}>{title}</div>
            <div style={{ fontSize: '0.95rem', color: isDark ? '#a1a1aa' : '#52525b' }}>{desc}</div>
        </div>
    </div>
);
