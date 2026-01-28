import React from "react";
import notFoundImage from "../404.png";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div style={{
            height: "100vh",
            width: "100vw",
            backgroundImage: `url(${notFoundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: "80px",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999
        }}>
            <Link to="/" style={{
                padding: "12px 30px",
                background: "rgba(255, 255, 255, 0.9)",
                color: "#1a202c",
                textDecoration: "none",
                borderRadius: "50px",
                fontWeight: "700",
                fontSize: "1.1rem",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                transition: "all 0.2s ease",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255,255,255,0.5)"
            }}
                onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.background = "#ffffff";
                    e.target.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.25)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.background = "rgba(255, 255, 255, 0.9)";
                    e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
                }}
            >
                Back to Home
            </Link>
        </div>
    );
}
