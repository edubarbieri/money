import React, { useState } from 'react';
import {LANG} from 'i18n/service';
import Calendar from 'react-calendar';
import { formatDate, getHumanDate, getParsedDate } from 'service/dateUtil';
import {If} from 'components/wrapper'

const Datepicker = ({date, setDate, title = '', collapsed = false}) => {
    const [formattedDate, setFormattedDate] = useState(getHumanDate(date))
    const [showDatepicker, setShowDatepicer] = useState(!collapsed);

    const handleFormattedDate = (value) => {
        const parsedDate = getParsedDate(value);
        if(parsedDate.isValid()){
            const humanDate = formatDate(value);
            setFormattedDate(humanDate);
            setDate(parsedDate.toDate(), humanDate);
            return;
        }
    }

    const handleSetDate = (value) => {
        setFormattedDate(getHumanDate(value));
        setDate(value, getHumanDate(value));
        if(collapsed){
            setShowDatepicer(false);
        }
    }

    return (
        <div className={(collapsed)? 'input-group date collapsed' : 'input-group date'}>
            {title && <label className="date-label">{title}</label>}
            <input type="text"
                className="form-control"
                value={getHumanDate(date)}
                onFocus={()=> (collapsed) ? setShowDatepicer(!showDatepicker) : ''}
                onChange={event => handleFormattedDate(event.target.value)} />
            <If test={showDatepicker}>
                <Calendar 
                    locale={LANG}
                    className="small-calendar"
                    value={date}
                    onChange={handleSetDate}
                />
            </If>
        </div>
    )
}

export default Datepicker;