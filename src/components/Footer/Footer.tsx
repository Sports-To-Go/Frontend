import "./Footer.scss";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-section">
                <div className="footer-section-table">
                    <div><b>Email</b></div>
                    <div>contact@sportstogo.com</div>
                    <div><b>Phone</b></div>
                    <div>0765 432 198</div>
                </div>

                <div className="footer-section-table">
                    <div>Somewhere No. 42</div>
                    <div><b>Street</b></div>
                    <div>Iasi, Romania</div>
                    <div><b>City</b></div>
                </div>
            </div>
            <div className="footer-section">
                <div>
                    Sports-To-Go
                </div>

                <div className="footer-section-row">
                    <a href="https://www.instagram.com/officialrickastley/">Instagram</a>
                    <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">YouTube</a>
                    <a href="https://www.tiktok.com/@rickastleyofficial?lang=en">TikTok</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;