import React from "react";
import '../scss/howitworks.scss';
const HowItWorks: React.FC<
{
    anchorRefs: React.RefObject<HTMLDivElement>[]
}
> = ({
    anchorRefs
}): JSX.Element => {
    return (
        <div className="hiw-credits">
            <div className="hiw" ref={anchorRefs[2]}>
                <h1>How It Works?</h1>
                <p>
                    This project was created to push myself to create a fully functional serverless web service. So I chose Cloudflare because I already use it to manage the DNS for some of my domains.
<br />
<br />
As a result, the frontend is hosted on Cloudflare Pages and employs Vanilla React and React Router. And the backend stores all of the website's data using Cloudflare Workers and Cloudflare KV.

<br />
<br />
I respect your privacy; at the end of your request, you can see what we store in my KV. I use WebCrypto to SHA256 hash your password and back half and encrypt your original URL with salted AES-GCM. 

<br />
<br />
I have no idea what your back half is or what your password is.  And, while I can decrypt every encrypted URL—after all, I need to in order to redirect your request—a malicious user cannot see your original URL, and they do not know your back half in the event of data compromise. In essence, your back half already serves as a password. But, after all, an extra layer of security is never a bad thing, right?

                </p>
            </div>
            <div className="credits" ref={anchorRefs[3]}>
                <h1>Credits</h1>
                <p>
                    The front-end design was inspired by this <a href="https://dribbble.com/shots/21462071-FlexFit-Web-Site-Design-Landing-Page-Home-Page-UI">Dribble Design</a>
                    . Icons provided by <a href="https://react-icons.github.io/react-icons/">React Icons</a> and <a href="https://icons8.com/">Icons8</a>
                    . Button Loading Animations provided by <a href="https://www.npmjs.com/package/react-spinners">React Spinners</a>
                    . QR Splash Image provided by <a href="https://unsplash.com/photos/EPeK7w5Eeic">Unsplash</a>.
                    <br />
                    <br />
                    Here is the source code for the <a href="https://github.com/reverseon/thrfi-fe">Frontend</a> and <a href="https://github.com/reverseon/thrfi-be">Backend</a>.
                </p>
            </div>
        </div>
    )
}

export default HowItWorks;