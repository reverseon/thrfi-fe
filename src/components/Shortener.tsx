import React from 'react';
import '../scss/shortener.scss';
import {
    FaStaylinked,
    FaClipboard,
    FaClipboardCheck
} from 'react-icons/fa';
import {
    BeatLoader
} from 'react-spinners';
import {
    BsEyeFill,
    BsEyeSlashFill,
} from 'react-icons/bs';
import {
    HiOutlineDownload
} from 'react-icons/hi';

import {
    GoAlertFill
} from 'react-icons/go';

import axios from 'axios';

interface URLFormData {
    url: string,
    custom: string,
    password: string,
    generate_qr: boolean,
    tos: boolean
}

interface URLFormResponse {
    short_url: string,
    original_url_encrypted: string,
    qrcode_b64?: string,
    qrcode_checksum?: string,
    backhalf_hashed?: string,
    password_hashed?: string,
}

interface FormValidation {
    url: ValidatorResponse,
    custom: ValidatorResponse,
    password: ValidatorResponse,
    generate_qr: ValidatorResponse,
    tos: ValidatorResponse
}

interface ValidatorResponse {
    valid: boolean,
    message: string
}

interface RequiredFormIsTouched {
    url: boolean,
}

enum FormState {
    IDLE,
    SUBMITTING,
    SUBMITTED,
    ERROR
}
const Shortener: React.FC<
{
    anchorRefs?: React.RefObject<HTMLDivElement>[],   
}> = ({
    anchorRefs
}) : JSX.Element => {
    let [isCopied, setIsCopied]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = React.useState(false);

    let [isPwdVisible, setIsPwdVisible]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = React.useState(false);

    let [URLFormResponse, setURLFormResponse]: [URLFormResponse, React.Dispatch<React.SetStateAction<URLFormResponse>>] = React.useState({
        short_url: '',
        original_url_encrypted: ''
    } as URLFormResponse);

    let [URLFormError, setURLFormError]: [string | null, React.Dispatch<React.SetStateAction<string|null>>] = React.useState(null as string | null);

    let [formIsTouched, setFormIsTouched]:
    [RequiredFormIsTouched, React.Dispatch<React.SetStateAction<RequiredFormIsTouched>>]
    = React.useState({
        url: false,
    } as RequiredFormIsTouched);
    
    let urlResultRef = React.useRef<HTMLDivElement>(null);

    let [formState, setFormState]:
    [FormState, React.Dispatch<React.SetStateAction<FormState>>]
    = React.useState(FormState.IDLE as FormState);

    let [formData, setFormData]
    : [URLFormData, React.Dispatch<React.SetStateAction<URLFormData>>]
    = React.useState({
        url: '',
        custom: '',
        password: '',
        generate_qr: false,
        tos: false
    } as URLFormData);

    let [formValidation, setFormValidation]
    : [FormValidation, React.Dispatch<React.SetStateAction<FormValidation>>]
    = React.useState({
        url: {
            valid: false,
            message: ''
        },
        custom: {
            valid: false,
            message: ''
        },
        password: {
            valid: false,
            message: ''
        },
        tos: {
            valid: false,
            message: ''
        }
    } as FormValidation);


    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const isURLValid = React.useCallback((url: string) : ValidatorResponse => {
        if (url.length === 0) {
            if (formIsTouched.url) {
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
    }, [formIsTouched.url]);

    const isPasswordValid = React.useCallback((password: string) : ValidatorResponse => {
        // at least 8 characters with only alphanumeric characters
        // check length
        if (password.length === 0) {
            return {
                valid: true,
                message: ''
            }
        }
        if (password.length < 8 || password.length > 64) {
            return {
                valid: false,
                message: 'Password must be between 8 and 64 characters'
            }
        } else if (!password.match(/^[0-9a-zA-Z]+$/)) {
            return {
                valid: false,
                message: 'Password must only contain alphanumeric characters'
            }
        }
        return {
            valid: true,
            message: ''
        }
    }, [])

    const isCustomValid = React.useCallback((custom: string) : ValidatorResponse => {
        // at least 3 characters with only alphanumeric characters
        // check length
        if (custom.length === 0) {
            return {
                valid: true,
                message: ''
            }
        }
        if (custom.length < 3 || custom.length > 64) {
            return {
                valid: false,
                message: 'Custom back-half must be between 3 and 64 characters'
            }
        } else if (!custom.match(/^[0-9a-zA-Z-]+$/)) {
            return {
                valid: false,
                message: 'Custom back-half must only contain alphanumeric characters or hyphenated (-) characters'
            }
        }
        return {
            valid: true,
            message: ''
        }
    }, [])

    React.useEffect(() => {
        // ignore the first render
        setFormValidation((prev) => {
            return {
                ...prev,
                url: isURLValid(formData.url),
                custom: isCustomValid(formData.custom),
                password: isPasswordValid(formData.password),
                generate_qr: {
                    valid: true,
                    message: ''
                },
                tos: {
                    valid: formData.tos,
                    message: ''
                }
            }
        })
    }, [formData, isURLValid, isCustomValid, isPasswordValid])

    React.useEffect(() => {
        if (urlResultRef.current) {
            urlResultRef.current.style.scrollMarginTop = '90px';
            urlResultRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [formState])
    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormState(FormState.SUBMITTING);
        // check if form is valid
        if (formValidation.url.valid && formValidation.custom.valid && formValidation.password.valid && formValidation.tos.valid) {
            let url = process.env.REACT_APP_API_URL! + process.env.REACT_APP_SHORTEN_EP!;
            let data: {
                url: string,
                backhalf?: string,
                password?: string
                qrcode?: boolean
            } = {
                url: formData.url,
            }
            if (formData.custom.length > 0) {
                data.backhalf = formData.custom;
            }
            if (formData.password.length > 0) {
                data.password = formData.password;
            }
            if (formData.generate_qr) {
                data.qrcode = true;
            }
            axios.post(url, data)
            .then((res) => {
                setFormState(FormState.SUBMITTED);
                setURLFormResponse(res.data);
            }).catch((err) => {
                setFormState(FormState.ERROR);
                setURLFormError(err.response?.data?.error);
            })
        } else {
            setFormState(FormState.ERROR);
        }
    }


    return (
        <div className="shortener" id="shortener" ref={anchorRefs![0]}>
            <div className="left-modal">
                <h1>URL Shortener</h1>
                <p>You can set the back-half (if available) or let us generate it for you. You can even protect it with a password too!</p>
                <small>e.g. <a href="https://thr.fi/my-favorite-song">https://thr.fi/my-favorite-song</a></small>
                <div className="bot-right-icon">
                    <FaStaylinked />
                </div>
            </div>
            <div className="right-form">
                { formState === FormState.ERROR &&
                <div className="alert invalid">
                    <GoAlertFill /> {
                        URLFormError && URLFormError.length > 0 ? URLFormError : 'Something went wrong. Please try again later.'
                    }
                </div>
                }
                {
                    formState === FormState.SUBMITTED &&
                    <div className="result" ref={urlResultRef}>
                        <h1 className="result-title">Yay! Here is your result.</h1>
                        <div className="result-body">
                            { formData.generate_qr &&
                            <div className="qr-w-btn">
                                <div className="qr-container">
                                    <img src={`data:image/png;base64, ${URLFormResponse.qrcode_b64}`} alt="QR Code" /> 
                                </div>
                                <button className='reset-btn' onClick={
                                    () => {
                                        let link = document.createElement('a');
                                        link.href = `data:image/png;base64, ${URLFormResponse.qrcode_b64}`;
                                        link.download = 'qr-code.png';
                                        link.click();
                                    }
                                }><HiOutlineDownload />Download QR Code</button>
                            </div>
                            }
                            <div className="result-main">
                                <div className="links">
                                    <div className="link">
                                        { formData.generate_qr &&
                                        <>
                                        <div className="link-title main">QR Code Checksum (MD5)</div>
                                        <div className="link-url main" style={{
                                            marginBottom: '10px'
                                        }}>{
                                            URLFormResponse.qrcode_checksum
                                        }</div>
                                        </>
                                        }
                                        <div className="link-title main">Shortened URL</div>
                                        <div className="link-url main">{
                                            URLFormResponse.short_url
                                        }</div>
                                        <button className='copy-btn'
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                URLFormResponse.short_url
                                            );
                                            setIsCopied(true);
                                            setTimeout(() => {
                                                setIsCopied(false);
                                            }, 2000);
                                        }}
                                        >
                                            { 
                                            !isCopied ?
                                                <><FaClipboard /> Copy Link</>
                                                : <><FaClipboardCheck /> Copied!</>
                                            }
                                        </button>
                                    </div>
                                    <div>
                                    <h2>What we store?</h2>
                                        <div className="link">
                                            <div className="link-title">Original URL (encrypted)</div>
                                            <div className="link-url">{
                                                URLFormResponse.original_url_encrypted.length > 0 ? URLFormResponse.original_url_encrypted : 'None'
                                            }</div>
                                        </div>
                                        <div className="link">
                                            <div className="link-title">Back-half (hashed)</div>
                                            <div className="link-url">{
                                                URLFormResponse.backhalf_hashed && URLFormResponse.backhalf_hashed.length > 0 ? URLFormResponse.backhalf_hashed : 'None'
                                            }</div>
                                        </div>
                                        <div className="link">
                                            <div className="link-title">Password (hashed)</div>
                                            <div className="link-url">{
                                                URLFormResponse.password_hashed && URLFormResponse.password_hashed.length > 0 ? URLFormResponse.password_hashed : 'None'
                                            }</div>
                                        </div>
                                    </div>
                                </div>
                                <button className="reset-btn" onClick={() => {
                                    setFormState(FormState.IDLE);
                                    setFormData((prev) => {
                                        return {
                                            ...prev,
                                            url: '',
                                            custom: '',
                                            password: '',
                                            generate_qr: false,
                                            tos: false
                                        }
                                    })
                                    setFormIsTouched((prev) => {
                                        return {
                                            ...prev,
                                            url: false,
                                        }
                                    })
                                    setIsPwdVisible(() => false);
                                    setURLFormResponse(() => {
                                        return {
                                            short_url: '',
                                            original_url_encrypted: '',
                                            backhalf_hashed: '',
                                            password_hashed: '',
                                            qrcode_checksum: ''
                                        }
                                    })
                                    setURLFormError(() => '');
                                }}>Shorten Another URL</button>
                            </div>
                        </div>
                    </div>
                }
                {
                    (formState === FormState.IDLE || formState === FormState.SUBMITTING || formState === FormState.ERROR) &&
                    <form onSubmit={onSubmitHandler}>
                        <div className="form-group f-100">
                            <label htmlFor="url" className="required">Paste Your URL Here</label>
                            <div className='line-form-flex'>
                                <input type="text" name="url" id="url" placeholder="https://thr.fi/my-favorite-song" 
                                onChange={(e) => {
                                    onChangeHandler(e);
                                    setFormIsTouched((prev) => {
                                        return {
                                            ...prev,
                                            url: true
                                        }
                                    })
                                }}
                                className={
                                    !formValidation.url.valid && formIsTouched.url ? 'invalid' : ''
                                }
                                disabled={formState === FormState.SUBMITTING}
                                />
                            </div>
                            <div className='feedback'>
                                <small >
                                    {formValidation.url.message}
                                </small>
                            </div>
                        </div>
                        <div className="form-group f-45">
                            <div className="line-form-flex">
                                <div className='input-prepend'>thr.fi/</div>
                                <input type="text" name="custom" id="custom" placeholder="your-back-half" 
                                className={
                                    formValidation.custom.valid ? '' : 'invalid'
                                }
                                onChange={onChangeHandler}
                                disabled={formState === FormState.SUBMITTING}
                                />
                            </div>
                            <div className='feedback'>
                                <small>
                                    {formValidation.custom.message}
                                </small>
                            </div>
                        </div>
                        <div className="form-group f-45">
                            <div className='line-form-flex' style={{
                                position: 'relative'
                            }}>
                                <input type={
                                    isPwdVisible ? 'text' : 'password'
                                } name="password" id="password" placeholder="Password" 
                                className={
                                    formValidation.password.valid ? '' : 'invalid'
                                }
                                onChange={onChangeHandler}
                                disabled={formState === FormState.SUBMITTING}
                                />
                                <div className="eye-icon" onClick={
                                    () => {
                                        setIsPwdVisible((prev) => !prev);
                                    }
                                }>
                                    {
                                        isPwdVisible ?
                                        <BsEyeFill/>
                                        : <BsEyeSlashFill/>
                                    }
                                </div>
                            </div>
                            <div className='feedback'>
                                <small>
                                    {formValidation.password.message}
                                </small>
                            </div>
                        </div>
                        <div className="form-group f-100">
                            <div className="line-form-flex f-start">
                                <input type="checkbox" name="generate_qr" id="generate_qr"
                                onChange={(e) => {
                                    setFormData((prev) => {
                                        return {
                                            ...prev,
                                            generate_qr: e.target.checked
                                        }
                                    })
                                }}
                                disabled={formState === FormState.SUBMITTING}
                                />
                                <label htmlFor="generate_qr">
                                    Also generate a QR code for this URL
                                </label>
                            </div>
                        </div>
                        {/* terms of service */}
                        <div className="form-group f-100">
                            <div className="line-form-flex f-start">
                                <input type="checkbox" name="tos" id="tos"
                                onChange={(e) => {
                                    setFormData((prev) => {
                                        return {
                                            ...prev,
                                            tos: e.target.checked
                                        }
                                    })
                                }}
                                disabled={formState === FormState.SUBMITTING}
                                />
                                <label htmlFor="tos">
                                    By using this service, you are acknowledging that this is a personal project and thus the service is not guaranteed to be available forever. You are also acknowledging that I am not responsible for any damages caused by this service.
                                </label>
                            </div>
                        </div>
                        <button className={
                            "url-form-submit " + 
                            (formValidation.url.valid && formValidation.custom.valid && formValidation.password.valid && formValidation.generate_qr.valid && formValidation.tos.valid ? 'valid' : 'invalid'
                            ) + (
                                formState === FormState.SUBMITTING ? ' submitting' : ''
                            )
                        }
                        disabled={
                            !formValidation.url.valid || !formValidation.custom.valid || !formValidation.password.valid || !formValidation.generate_qr.valid ||  !formValidation.tos.valid || formState === FormState.SUBMITTING
                        }
                        >
                            {
                                formState === FormState.SUBMITTING ?
                                <BeatLoader color={'#ffbe08'} size={10} />
                            : 
                                'Shorten URL'
                            }
                        </button>
                    </form>
                }
            </div>
        </div>
    )
}

export default Shortener;