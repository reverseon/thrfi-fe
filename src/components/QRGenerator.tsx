import React from 'react';
import '../scss/qrgenerator.scss';
import {
    BsQrCodeScan
} from 'react-icons/bs';
import {
    BeatLoader
} from 'react-spinners';
import { GoAlertFill } from 'react-icons/go';
import { HiOutlineDownload } from 'react-icons/hi';
import axios from 'axios';
interface FormData {
    url: string;
}

interface FormValidation {
    url: ValidatorResponse;
}

interface FormResponse {
    qrcode_b64: string;
    qrcode_checksum: string;
}
    

interface ValidatorResponse {
    valid: boolean;
    message: string;
}

interface RequiredFormIsTouched {
    url: boolean;
}

enum FormState {
    IDLE,
    SUBMITTING,
    SUBMITTED,
    ERROR
}

const QRGenerator: React.FC<
{
    anchorRefs: React.RefObject<HTMLDivElement>[]
}
> = ({
    anchorRefs
}): JSX.Element => {
    let resultRef = React.useRef<HTMLDivElement>(null);
    let [serverErrorResponse, setServerErrorResponse] = React.useState<string>('');
    let [formResponse, setFormResponse] = React.useState<FormResponse>({
        qrcode_b64: '',
        qrcode_checksum: ''
    });
    let [formState, setFormState] = React.useState<FormState>(FormState.IDLE);
    let [formData, setFormData] = React.useState<FormData>({
        url: ''
    });
    let [formValidation, setFormValidation] = React.useState<FormValidation>({
        url: {
            valid: false,
            message: ''
        }
    });

    let [requiredFormIsTouched, setRequiredFormIsTouched] = React.useState<RequiredFormIsTouched>({
        url: false
    });

    const isURLValid = React.useCallback((url: string) : ValidatorResponse => {
        if (formData.url.length === 0) {
            if (requiredFormIsTouched.url) {
                return {
                    valid: false,
                    message: 'URL cannot be empty'
                }
            } else {
                return {
                    valid: false,
                    message: ''
                }
            }
        } else if (url.length > 2048) {
            return {
                valid: false,
                message: 'URL cannot be longer than 2048 characters'
            }
        }
        const regex = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        if(!regex.test(url)) {
            return {
                valid: false,
                message: 'Invalid URL'
            }
        }
        return {
            valid: true,
            message: ''
        }
    }, [
        formData.url.length,
        requiredFormIsTouched.url
    ])
    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }
    React.useEffect(() => {
        setFormValidation((prev) => {
            return {
                ...prev,
                url: isURLValid(formData.url)
            }
        })
    }, [formData, isURLValid])
    
    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formValidation.url.valid) {
            setFormState(FormState.SUBMITTING);
            // setTimeout(() => {
            //     // if (formData.url === 'https://something.wentwrong') {
            //     //     setFormState(FormState.ERROR);
            //     // } else {
            //     //     setFormState(FormState.SUBMITTED);
            //     //     anchorRefs[1].current?.scrollIntoView({
            //     //         behavior: 'smooth'
            //     //     });
            //     // }
                    
            // }, 2000)

            let endpoint = process.env.REACT_APP_API_URL! + process.env.REACT_APP_QR_EP!
            axios.get(endpoint, {
                params: {
                    url: formData.url
                }
            }).then((res) => {
                setFormState(FormState.SUBMITTED);
                anchorRefs[1].current?.scrollIntoView({
                    behavior: 'smooth'
                });
                setFormResponse(res.data);
            }).catch((err) => {
                setFormState(FormState.ERROR);
                setServerErrorResponse(err.response?.data?.message);
            })
        } else {
            setFormState(FormState.ERROR);
        }
    }
    return (
        <div className='qr-generator' ref={anchorRefs[1]}>
            <div className="left-modal">
                <h1 ref={resultRef}>QR Code Generator</h1>
                { formState !== FormState.SUBMITTED ?
                <>
                <h3>Just paste your URL and get the QR Code. Dead simple!</h3>
                <form onSubmit={onSubmitHandler}>
                    { formState === FormState.ERROR &&
                    <div className='alert invalid'>
                        <GoAlertFill /> {
                            serverErrorResponse && serverErrorResponse.length > 0 ? serverErrorResponse : 'Something went wrong. Please try again later.'
                        }
                    </div>
                    }
                    <input type="text" placeholder='Enter URL' name="url" onChange={(e) => {
                        onChangeHandler(e);
                        setRequiredFormIsTouched((prev) => {
                            return {
                                ...prev,
                                url: true
                            }
                        })   
                    }}
                    
                    className={
                        formValidation.url.valid || !requiredFormIsTouched.url ? '' : 'invalid'
                    }
                    />
                    { formValidation.url.message.length > 0 && 
                        <span className="form-feedback">{formValidation.url.message}</span>
                    }
                    <button type='submit' disabled={
                        formState === FormState.SUBMITTING || !formValidation.url.valid
                    }>
                        {
                            formState === FormState.SUBMITTING ? <BeatLoader color={
                                '#000000'
                            } size={8} /> : 'Generate QR Code'
                        }
                    </button>
                </form>
                </> : <>
                <h3>Here's your QR Code!</h3>
                <div className='qr-code-result'>
                    <div className="qr-container">
                        <img src={
                            `data:image/png;base64,${formResponse.qrcode_b64}`
                        } alt="QR Code" />
                    </div>
                    <div className="qr-info">
                        <button className='download-btn' onClick={
                            () => {
                                const a = document.createElement('a');
                                a.href = `data:image/png;base64,${formResponse.qrcode_b64}`;
                                a.download = 'qr-code.png';
                                a.click();
                            }
                        }><HiOutlineDownload />Download QR Code</button>
                        <button
                        onClick={
                            () => {
                                setFormState(FormState.IDLE);
                                setRequiredFormIsTouched({
                                    url: false
                                })
                                setFormData({
                                    url: ''
                                })
                                setFormResponse({
                                    qrcode_b64: '',
                                    qrcode_checksum: ''
                                })
                                setServerErrorResponse('');
                            }
                        }
                        >Generate Another QR Code</button>
                        <p id="qr-hash">
                            <span>Checksum (MD5):</span> <span>0xc222e1c19600053f687d1029d95e18dc</span>
                        </p>
                    </div>
                </div>
               
                </>
                }
            </div>
            <div className='right-modal'>
                <h1>Fun fact!</h1>
                <p>
                The QR code system was invented in 1994 under a team led by Masahiro Hara from the Japanese company Denso Wave. The initial design was influenced by the black and white pieces on a Go board.
                </p>
                <a href="https://en.wikipedia.org/wiki/QR_code">Source</a>
                <div className='icon-container'>
                    <BsQrCodeScan />
                </div>
            </div>
        </div>
    );
}

export default QRGenerator;