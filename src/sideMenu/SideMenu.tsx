
import { useContext, useState } from 'react';
import './SideMenu.css';
import MenuRoles from './roles/MenuRoles';
import SideButtons from './SideButtons';
import SideDropdown from './dropdown/SideDropdown';
import { GameContext, GameContextType } from '../data/gameState';
import Footer from './Footer';

export default function SideMenu() {
    const { appState } = useContext(GameContext) as GameContextType;

    const [offset, setOffset] = useState(-300);

    if (!appState.tokenDataVisible) return <></>;

    function openMenu() {
        setOffset(0);
    }

    function closeMenu() {
        setOffset(-300);
    }

    return (
        <>
            <div className="SideMenu__openButton" style={{ backgroundImage: 'url("assets/menu_open.png")' }} onClick={openMenu} role="button"></div>
            <div className="SideMenu__container" style={{ transform: `translateX(${offset}px)`, backgroundImage: "url('/assets/background-img2.webp')" }}>
                <div className="SideMenu__logo" style={{backgroundImage: "url('assets/botc_logo.png')"}}></div>
                <div className='SideMenu__closeButton' style={{ backgroundImage: `url("assets/close.png")` }} onClick={closeMenu} role="button"></div>

                <div className='SideMenu__body'>
                    <SideDropdown />
                    <SideButtons />
                    <MenuRoles />
                    <br />
                    <Footer />
                </div>
            </div>
        </>
    )
}
