import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import RotatingIcon from "./RotatingIcon";

export default function WelcomeIntro() {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check session storage
        // If "hasSeenIntro" is NOT set, show it.
        const hasSeen = sessionStorage.getItem("hasSeenIntro");
        if (!hasSeen) {
            setIsVisible(true);
        }
    }, []);

    useGSAP(() => {
        if (!isVisible) return;

        // Wait for video end or some trigger to animate out
        // Since we don't have a real video yet, we can simulate or use onEnded
    }, [isVisible]);

    const handleVideoEnd = () => {
        // 1. Mark as seen
        sessionStorage.setItem("hasSeenIntro", "true");

        // 2. Animate Out
        gsap.to(containerRef.current, {
            height: 0,
            opacity: 0,
            marginBottom: 0,
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => setIsVisible(false) // Unmount
        });
    };

    if (!isVisible) return null;

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                width: "100%",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                overflow: "hidden",
                marginBottom: "40px",
            }}
        >
            {/* 
         VIDEO ELEMENT 
         Replace src with your actual video or uploaded asset.
         Using a placeholder animation for now.
      */}
            <div style={{ position: "relative", width: "40%", maxWidth: "800px", aspectRatio: "16/9", background: "black", borderRadius: "10px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>

                <video
                    ref={videoRef}
                    src="/welcome.mp4"
                    autoPlay
                    muted
                    playsInline
                    onEnded={handleVideoEnd}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {/* SKIP BUTTON OVERLAY */}
                <button
                    onClick={handleVideoEnd}
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        right: "20px",
                        padding: "8px 20px",
                        background: "rgba(0,0,0,0.6)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        color: "white",
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        backdropFilter: "blur(4px)"
                    }}
                >
                    SKIP &rarr;
                </button>

            </div>



        </div>
    );
}
