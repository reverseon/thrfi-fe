import React from 'react';
import '../scss/_reset.scss'
import '../scss/go.scss'
import {
    AiTwotoneUnlock
} from 'react-icons/ai'
import {
    BeatLoader
} from 'react-spinners'
import { GoAlertFill } from 'react-icons/go';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface FormData {
    password: string
}


enum FormState {
    IDLE,
    SUBMITTING,
    ERROR
}

enum GoState {
    OK,
    LOCKED,
    NOT_FOUND
}
const Go: React.FC = () : JSX.Element => {
    let {key} = useParams<{key: string}>();
    let [serverFeedback, setServerFeedback] = React.useState<string>('')
    let [formState, setFormState] = React.useState<FormState>(FormState.IDLE)
    let [formData, setFormData] = React.useState<FormData>({
        password: ''
    })
    let [goState, setGoState] = React.useState<GoState>(GoState.OK)
    React.useEffect(() => {
        let endpoint = process.env.REACT_APP_API_URL! + process.env.REACT_APP_FETCH_EP! + '/' + key
        axios.get(endpoint)
        .then(res => {
            let url = res.data.url
            // add https:// if not present
            if (!url.startsWith('http')) {
                url = 'https://' + url
            }
            window.location.replace(url)
        })
        .catch(err => {
            try {
                if (err.response.status === 401) {
                    setGoState(() => GoState.LOCKED)
                } else {
                    setGoState(() => GoState.NOT_FOUND)
                }
            } catch (e) {
                setGoState(() => GoState.NOT_FOUND)
            }
        })
    }, [key])

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        });
    }
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormState(FormState.SUBMITTING)
        let endpoint = process.env.REACT_APP_API_URL! + process.env.REACT_APP_UNLOCK_EP! + '/' + key
        let body = {
            password: formData.password
        }
        axios.post(endpoint, body)
        .then(res => {
            let url = res.data.url
            // add https:// if not present
            if (!url.startsWith('http')) {
                url = 'https://' + url
            }
            window.location.replace(url)
        })
        .catch(err => {
            setFormState(FormState.ERROR)
            setServerFeedback(err.response?.data.error)
        })
    } 

    return (
        <div className='go-to'>
            { goState === GoState.LOCKED &&
            <h5>This Link is Protected. Enter Password To Access</h5>
            }
            {
                goState === GoState.NOT_FOUND &&
                <h5>Link Not Found! Please Check the URL.</h5>
            }
            {
                goState === GoState.OK &&
                <h5>Redirecting...</h5>
            }
            { goState === GoState.LOCKED &&
            <form onSubmit={handleFormSubmit}>
                {formState === FormState.ERROR &&
                <div className='alert error'>
                    <p><GoAlertFill />{serverFeedback}</p>
                </div>
                }
                <input type='password' name="password" placeholder='Enter password' onChange={handleFormChange}/>
                <button type='submit' disabled={
                    formState === FormState.SUBMITTING
                }>
                    {formState === FormState.SUBMITTING ?
                        <BeatLoader color='#000' size={10} />
                        :
                    <><AiTwotoneUnlock /> Unlock</> }</button>
            </form>
            }
        </div>
    );
}

export default Go;