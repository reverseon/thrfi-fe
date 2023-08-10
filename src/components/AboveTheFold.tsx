import React from "react";
import '../scss/abovethefold.scss'
import {
    ImQrcode
} from 'react-icons/im'
import '../img/qr.jpg'
import { TbRectangleVerticalFilled } from "react-icons/tb";
import CountUp from "react-countup";

const AboveTheFold: React.FC<
{
    anchorRefs?: React.RefObject<HTMLDivElement>[],
}
> = ({
    anchorRefs
}): JSX.Element => {
    return (
        <>
            <div className="above-the-fold">
                <div className="above-the-fold-content">
                    <div className="big">
                        <div className="pre-title">
                            <TbRectangleVerticalFilled /><TbRectangleVerticalFilled /><span>MY PERSONAL URL SHORTENER</span>
                        </div>
                        <div className="main-title">
                            <h1>SHARE YOUR URL. NOW SHORTER.</h1>
                            <h5>or rather, my url idk.</h5>
                        </div>
                        <div className="post-title">
                            <a className="go-button" href="https://thr.fi" onClick={
                                (e) => {
                                    e.preventDefault();
                                    if (anchorRefs) {
                                        anchorRefs[0].current!.style.scrollMarginTop = "100px";
                                        anchorRefs[0].current!.scrollIntoView({
                                            behavior: "smooth",
                                            block: "start",
                                            inline: "nearest"
                                        });
                                    }
                                }
                            }>SHORTEN YOUR URL</a>
                            <a className="plain-anchor" href="https://thr.fi" onClick={(e) => {
                                e.preventDefault();
                                if (anchorRefs) {
                                    anchorRefs[2].current!.style.scrollMarginTop = "100px";
                                    anchorRefs[2].current!.scrollIntoView({
                                        behavior: "smooth",
                                    });
                                }
                            }}>How It Works?</a>
                        </div>
                    </div>
                    <a className="small" href="https://thr.fi" onClick={
                        (e) => {
                            e.preventDefault();
                            if (anchorRefs) {
                                anchorRefs[1].current!.style.scrollMarginTop = "100px";
                                anchorRefs[1].current!.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }
                        }
                    }>
                        <div className="small-icon">
                            <ImQrcode />
                        </div>
                        <h5 className="tag-headline">OR TRY THE QR CODE GENERATOR</h5>
                        <div className="blur-bg"></div>
                    </a>
                </div>
                <div className="above-the-fold-stats">
                    <div className="stat">
                        <h1><CountUp end={81} duration={2}></CountUp></h1>
                        <h5>URLs Shortened</h5>
                    </div>
                    <div className="stat">
                        <h1><CountUp end={214} duration={2}></CountUp></h1>
                        <h5>QR Codes Generated</h5>
                    </div>
                    <div className="stat">
                        <h1><CountUp end={122} duration={2}></CountUp>K</h1>
                        <h5>URLs Visited</h5>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AboveTheFold;