import React from 'react';
import '../scss/footer.scss'
import {
    LuCopyright
} from 'react-icons/lu'

const Footer: React.FC<
{
    anchorRefs: React.RefObject<HTMLDivElement>[]
}
> = ({
    anchorRefs
}): JSX.Element => {
    return (
        <div className='footer'>
            <LuCopyright /> 2023 Thirafi Najwan
        </div>
    )
}

export default Footer;