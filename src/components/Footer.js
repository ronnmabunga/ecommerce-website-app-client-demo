import React from "react";
import "../styles/Footer.css";
import { FaFacebook, FaInstagramSquare  } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2024 The Bean Counter. All Rights Reserved.</p>
                <ul className="social-media">
                    <li>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebook />
                        </a>
                    </li>
                    <li>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaXTwitter />
                        </a>
                    </li>
                    <li>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagramSquare />
                        </a>
                    </li>
                </ul>
                <p>
                    Contact us: <a href="mailto:support@thebeancounter.com">support@thebeancounter.com</a>
                </p>
            </div>
        </footer>
    );
}
