import React from 'react';
import { bundle } from 'i18n/bundle';
import 'style/error.scss';
import { isMobile } from 'services/Util';
import HeaderBasic from './HeaderBasic';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false
        };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
    }

    render() {
        if (!this.state.hasError) {
            return <div className="error-page">
                {isMobile(this.state.resize) && <HeaderBasic />}
                <img src="/img/ops.png" alt="error page"/>
                <h5>{bundle('error.page.message1')}</h5>
                <h5>{bundle('error.page.message2')}</h5>
            </div>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;