import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "../services/api";
import ComponentCard from "../components/ComponentCard";
import RotatingIcon from "../components/RotatingIcon";
import { useTheme } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

export default function Explore({ user }) {
    const navigate = useNavigate();
    const { colors, mode } = useTheme();
    const isDark = mode === 'dark';

    // State
    const [displayComponents, setDisplayComponents] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 8;

    // UI State
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [showNpmOnly, setShowNpmOnly] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Refs
    const containerRef = useRef(null);
    const heroTextRef = useRef(null);
    const gridRef = useRef(null);
    const loaderRef = useRef(null);

    // 1. Initial Category Fetch
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get("/categories");
                setCategories(res.data.categories || []);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    // 2. Main Data Fetch (Reset on Filter Change)
    useEffect(() => {
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchData(1, true);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, activeCategory, showNpmOnly]);

    // 3. Load More (Append) (Optimized)
    const loadMoreItems = () => {
        if (!loading && !loadingMore && !isSearching && hasMore) {
            fetchData(page + 1, false);
        }
    };

    const fetchData = async (pageNum, isReset) => {
        if (isReset) {
            // Only show full skeleton loader on INITIAL load (empty list)
            // Otherwise, just show small spinner (background search)
            if (displayComponents.length === 0) {
                setLoading(true);
            } else {
                setIsSearching(true);
            }
            setPage(1);
        } else {
            setLoadingMore(true);
        }

        try {
            const params = {
                page: pageNum,
                limit: ITEMS_PER_PAGE,
                search: searchTerm,
                category: activeCategory || "",
                npmOnly: showNpmOnly
            };

            const res = await api.get("/public", { params });
            const newData = res.data.components || [];

            if (isReset) {
                setDisplayComponents(newData);
            } else {
                setDisplayComponents(prev => [...prev, ...newData]);
            }

            setHasMore(newData.length === ITEMS_PER_PAGE);
            if (!isReset) setPage(pageNum);

        } catch (error) {
            console.error(error);
        } finally {
            // Clear all loading states
            setLoading(false);
            setIsSearching(false);
            setLoadingMore(false);
        }
    };

    // 4. Infinite Scroll Observer (Pre-load buffer)
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading && !loadingMore && !isSearching) {
                loadMoreItems();
            }
        }, {
            root: null,
            rootMargin: "400px", // Trigger 400px BEFORE reaching bottom
            threshold: 0
        });

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasMore, loading, loadingMore, isSearching, page, searchTerm, activeCategory, showNpmOnly]);


    // 4. Kinetic Animations
    useGSAP(() => {
        // Parallax Hero Text
        if (heroTextRef.current) {
            gsap.to(".hero-line-1", {
                x: "-10%",
                opacity: 0.5,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "500px top",
                    scrub: 1
                }
            });
            gsap.to(".hero-line-2", {
                x: "10%",
                opacity: 0.5,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "500px top",
                    scrub: 1
                }
            });
        }

        // Grid Entrance Stagger (Subtle Micro-interaction)
        // Only run if NOT background searching (prevents re-animating existing cards weirdly)
        if (!loading && !isSearching) {
            ScrollTrigger.batch(".explore-card-wrapper", {
                onEnter: batch => gsap.fromTo(batch,
                    { y: 20, opacity: 0 }, // Very subtle slide up
                    { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: "power2.out" }
                ),
                start: "top 90%"
            });
        }

    }, [loading, isSearching, displayComponents]);


    // Skeleton Component
    const ExploreSkeleton = () => (
        <div style={{ aspectRatio: "3/4", background: isDark ? "#1a1a1a" : "#f0f0f0", borderRadius: "16px", overflow: "hidden", position: "relative" }}>
            <div style={{ width: "100%", height: "100%", position: 'absolute', inset: 0, background: `linear-gradient(90deg, transparent, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}, transparent)`, animation: "shimmer 1.5s infinite" }} />
            <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
        </div>
    );

    return (
        <div ref={containerRef} style={{ minHeight: "200vh", position: "relative" }}>

            {/* KINETIC HERO */}
            <div style={{
                height: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                overflow: "hidden", position: "relative", perspective: "1000px"
            }}>
                {/* Background Noise/Gradient */}
                <div style={{
                    position: "absolute", inset: "-50%", width: "200%", height: "200%",
                    background: isDark
                        ? "radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 70%)"
                        : "radial-gradient(circle at 50% 50%, #fff 0%, #f0f0f0 70%)",
                    opacity: 0.5, pointerEvents: "none", zIndex: -1
                }}></div>

                <div ref={heroTextRef} style={{ textAlign: "center", zIndex: 1 }}>
                    <h1 className="hero-line-1" style={{
                        fontSize: "clamp(4rem, 12vw, 10rem)", fontWeight: "900", lineHeight: "0.85",
                        textTransform: "uppercase", color: colors.text, whiteSpace: "nowrap",
                        marginLeft: "-20vw", fontFamily: "'Inter', sans-serif"
                    }}>
                        Infinite
                    </h1>
                    <h1 className="hero-line-2" style={{
                        fontSize: "clamp(4rem, 12vw, 10rem)", fontWeight: "900", lineHeight: "0.85",
                        textTransform: "uppercase", color: "transparent", WebkitTextStroke: `2px ${colors.text}`,
                        whiteSpace: "nowrap", marginRight: "-20vw", fontFamily: "'Inter', sans-serif"
                    }}>
                        Creativity
                    </h1>
                </div>

                <div style={{ marginTop: "40px", animation: "bounce 2s infinite" }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2">
                        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                    </svg>
                </div>
                <style>{`@keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 40% {transform: translateY(-10px);} 60% {transform: translateY(-5px);} }`}</style>
            </div>

            {/* STICKY FILTER BAR */}
            <div style={{
                position: "sticky", top: "20px", zIndex: 100,
                display: "flex", justifyContent: "center", padding: "0 20px", marginBottom: "60px"
            }}>
                <div style={{
                    display: "flex", flexWrap: "wrap", gap: "10px", padding: "10px",
                    background: isDark ? "rgba(20,20,20,0.8)" : "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(20px)", borderRadius: "100px", border: `1px solid ${colors.border}`,
                    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)"
                }}>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <input
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                background: "transparent", border: "none", outline: "none",
                                color: colors.text, padding: "10px 20px", minWidth: "200px"
                            }}
                        />
                        {isSearching && (
                            <div style={{ position: 'absolute', right: '10px' }}>
                                <div style={{
                                    width: "16px", height: "16px", borderRadius: "50%",
                                    border: `2px solid ${colors.text}`, borderTopColor: "transparent",
                                    animation: "spin 1s linear infinite"
                                }}></div>
                                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                            </div>
                        )}
                    </div>
                    <div style={{ width: "1px", background: colors.border }}></div>

                    {/* NPM TOGGLE */}
                    <button
                        onClick={() => setShowNpmOnly(!showNpmOnly)}
                        style={{
                            background: showNpmOnly ? "rgba(139, 92, 246, 0.1)" : "transparent",
                            border: "none",
                            color: showNpmOnly ? "#8b5cf6" : colors.text,
                            fontWeight: "700", cursor: "pointer", padding: "0 15px",
                            display: "flex", alignItems: "center", gap: "6px"
                        }}
                    >
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: showNpmOnly ? "#8b5cf6" : "transparent", border: `1px solid ${showNpmOnly ? "#8b5cf6" : colors.text}` }}></span>
                        NPM
                    </button>

                    {/* (Buttons removed as requested) */}
                </div>
            </div>

            {/* INFINITE CATEGORY MARQUEE */}
            <div style={{
                width: "100%", overflow: "hidden", background: isDark ? "#000" : "#fff",
                borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}`,
                padding: "15px 0", marginBottom: "40px", position: "relative"
            }}>
                <div style={{
                    display: "flex", whiteSpace: "nowrap", width: "max-content",
                    animation: "marquee 20s linear infinite"
                }}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} style={{ display: "flex", gap: "40px", paddingRight: "40px" }}>
                            {categories.map(cat => (
                                <span key={cat}
                                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                                    // Double click as requested, though single click toggle handles deselect too
                                    onDoubleClick={() => setActiveCategory(null)}
                                    title="Click to toggle filter"
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", fontWeight: "700",
                                        color: activeCategory === cat ? colors.accent : (isDark ? "#333" : "#ddd"),
                                        cursor: "pointer", transition: "color 0.3s", textTransform: "uppercase"
                                    }}>
                                    {cat} <span style={{ color: colors.accent, marginLeft: "10px" }}>•</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
                <style>{`
                    @keyframes marquee { 
                        0% { transform: translateX(0); } 
                        100% { transform: translateX(-25%); } 
                    }
                    /* Pause on hover for easier clicking */
                    div:hover > div { animation-play-state: paused; }
                `}</style>
            </div>

            {/* FLUID GRID */}
            <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 20px" }}>
                {loading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px" }}>
                        {[...Array(6)].map((_, i) => <ExploreSkeleton key={i} />)}
                    </div>
                ) : (
                    <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px", minHeight: "500px" }}>
                        {displayComponents.map((c, i) => (
                            <div key={`${c._id}-${i}`} className="explore-card-wrapper">
                                <ComponentCard
                                    component={c} user={user} navigate={navigate}
                                    onApprove={async () => { }} // Placeholder
                                    minimal={false}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* LOADING MORE TRIGGER */}
                <div ref={loaderRef} style={{ height: "100px", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "40px" }}>
                    {loadingMore && <RotatingIcon size={60} />}
                    {!loadingMore && !hasMore && displayComponents.length > 0 && (
                        null
                    )}
                </div>
            </div>
        </div>
    );
}
