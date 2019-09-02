import React from 'react';
import bundle from 'i18n/bundle'
const Footer = () => {
    return (
        <footer className="footer-main">
            <strong>
                <a rel="noopener noreferrer" target="_blank" href="https://github.com/mdsbarbieri/money">Money - </a>
            </strong>
            {bundle('footer.message')}
            <strong>
                <a rel="noopener noreferrer" target="_blank" href="https://github.com/edubarbieri">Eduardo Barbieri</a>
            </strong>
            &nbsp;{bundle('and')}&nbsp;
            <strong>
                <a rel="noopener noreferrer" target="_blank" href="https://twitter.com/mdsbarbieri">Matheus Barbieri</a>
            </strong>
        </footer>
    );
}

export default Footer;