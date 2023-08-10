import React from "react";
import '../scss/header.scss'
import {
    AiOutlineLink
} from 'react-icons/ai';

import  {
    TbExternalLink
} from 'react-icons/tb';

interface Link {
    name: string,
    link: string
}
const Header: React.FC<
{
    anchorRefs?: React.RefObject<HTMLDivElement>[],
}
> = ({
    anchorRefs
}) : JSX.Element => {
    const links: React.RefObject<Link[]> = React.useRef([
        {
            name: "Link Shortener",
            link: "#"
        },
        {
            name: "QR Code Generator",
            link: "#"
        },
        {
            name: "How it Works",
            link: "#"
        },
        {
            name: "Credits",
            link: "#"
        }
    ])
    const checkboxToggleRef: React.RefObject<HTMLInputElement> = React.useRef(null);
    return (
        <>
            <input type="checkbox" id="toggle" ref={checkboxToggleRef} />
            <nav className="header">
                <ul>
                    <li className="above" key={1}>
                        <a href="https://thr.fi" onClick={(e) => {
                            e.preventDefault();
                            if (checkboxToggleRef.current) checkboxToggleRef.current.checked = false;
                            // scroll to top
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            })  
                        }}>
                            <h1 className='title'>
                                <AiOutlineLink className="brand-icon"/>thr.fi
                            </h1>
                        </a>
                    </li>
                    <ul className="navbar-link" key={2}>
                        {links.current!.map((link, index) => {
                            return (
                                <li key={index}><a href={link.link} onClick={
                                    (e) => {
                                        e.preventDefault();
                                        if (anchorRefs) {
                                            anchorRefs[index].current!.style.scrollMarginTop = "100px";
                                            anchorRefs[index].current?.scrollIntoView({behavior: "smooth"});
                                        }
                                    }
                                }>{link.name}</a></li>
                            )
                        })}
                    </ul>
                    <li className="li-visit-button" key={3}><a className="visit-button" href="https://www.naj.one"><TbExternalLink className="brand-icon" />Visit My Page</a></li>
                    <label key={4} htmlFor="toggle" className="navbar-toggle above">
                        <div className="navbar-hamburger" key={'dsadasi'}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </label>
                </ul>
            </nav>
            <div className="navbar-link-mobile">
                <ul className="nv-ctr"> 
                    {links.current!.map((link, index) => {
                        return (
                            <div key={index} >
                            <li><a href={link.link} onClick={
                                (e) => {
                                    e.preventDefault();
                                    if (checkboxToggleRef.current) {
                                        checkboxToggleRef.current.checked = false;
                                    }
                                    anchorRefs![index].current!.style.scrollMarginTop = "100px";
                                    anchorRefs![index].current?.scrollIntoView({behavior: "smooth"});
                                }
                            }>{link.name}</a>
                            </li>
                            <hr/>
                            </div>
                        )
                    })}
                </ul>
                <div className="li-visit-button-mbl"><a className="visit-button-mbl" href="https://www.naj.one"><TbExternalLink className="brand-icon" />Visit My Page</a></div>
            </div>
        </>
    )
}

export default Header;