import React from "react";
import '../scss/landing.scss'
import Header from "../components/Header";
import AboveTheFold from "../components/AboveTheFold";
import Services from "../components/Shortener";
import QRGenerator from "../components/QRGenerator";
import HIWnCredits from "../components/HIWnCredits";
import Footer from "../components/Footer";

const Landing: React.FC = () : JSX.Element => {
    let [anchorRefs, ] = React.useState<React.RefObject<HTMLDivElement>[]>([
        React.useRef(null),
        React.useRef(null),
        React.useRef(null),
        React.useRef(null)
    ])
    return (
        <>
        <Header anchorRefs={anchorRefs}/>
        <div className="x-pads main">
            <AboveTheFold anchorRefs={anchorRefs}/>
            <Services anchorRefs={anchorRefs}/>
            <QRGenerator anchorRefs={anchorRefs}/>
            <HIWnCredits anchorRefs={anchorRefs}/>
            <Footer anchorRefs={anchorRefs} />
        </div>
        </>
    );
}

export default Landing;