import "./Navbar.scss";
import Logo from "../Logo/Logo.tsx";
import NavTab from "../NavTab/NavTab.tsx";
import { GrHomeRounded, GrLanguage } from "react-icons/gr";
import { FaRegSquarePlus } from "react-icons/fa6";
import { CiMenuBurger, CiUser, CiMap } from "react-icons/ci";
import { NavLink } from "react-router-dom";
const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Logo/>
                <div className="navbar-menu">
                    <NavTab icon={<GrHomeRounded/>} text="Your Home" dest="/"/>
                    <NavTab icon={<FaRegSquarePlus/>} text="Your Locations" dest="/profile#locations"/>
                    <NavTab icon={<CiMap/>} text="Find Locations" dest="/locations"/>
                </div>
                <div className="navbar-right-container">
                    {/* Language changes to be implemented */}
                    <GrLanguage/> 

                    {/* This should actually open a modal with some option and a way to change the switch between dark and light mode*/}
                    <NavLink to="/profile" className="navbar-profile-container">  
                        <CiMenuBurger style={{fontSize: 24}}/>
                        <CiUser style={{fontSize: 32}}/>
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;