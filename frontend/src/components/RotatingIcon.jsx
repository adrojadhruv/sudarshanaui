import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import goldenCircle from "../assets/golden_circle.png";

export default function RotatingIcon({ size = 100 }) {
    const iconRef = useRef(null);

    useGSAP(() => {
        gsap.to(iconRef.current, {
            rotation: 360,
            duration: 10, // Slower, infinite rotation
            repeat: -1,
            ease: "linear"
        });
    }, { scope: iconRef });

    return (
        <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
                ref={iconRef}
                src={goldenCircle}
                alt="Sudarshana Chakra"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    filter: "drop-shadow(0 0 15px rgba(251, 191, 36, 0.4))" // Golden glow
                }}
            />
        </div>
    );
}
