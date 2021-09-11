import React from 'react';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

type EpochProps = {};

type EpochState = {
    datetime: string;
    timezone: string;
    value: number;
};

export default class Epoch extends React.Component<EpochProps, EpochState> {
    constructor(props: EpochProps) {
        super(props);

        this.state = {
            datetime: "1970-01-01T00:00",
            timezone: "America/New_York",
            value: 0,
        };
    }

    changeTimezone(event: any) {
        this.setState({ timezone: event.target.value });
    }

    changeDatetime(event: any) {
        this.setState({ datetime: event.target.value });
    }

    componentDidUpdate(prevProps: EpochProps, prevState: EpochState) {
        if (this.state.datetime !== prevState.datetime || this.state.timezone !== prevState.timezone) {
            const epoch = dayjs.tz(this.state.datetime, this.state.timezone);
            this.setState({ value: epoch.utc().unix() });
        }
    }

    render() {
        dayjs.tz
        return (
            <form>
                <label htmlFor="timezone" className="f6 b db mb2">Timezone</label>
                <select id="timezone" name="timezone" defaultValue="America/New_York" onChange={(e) => this.changeTimezone(e)} className="ba b--black-20 pa2 mb2 db w-100">
                    <optgroup label="America">
                        <option value="America/Los_Angeles">Los Angeles</option>
                        <option value="America/New_York">New York</option>
                    </optgroup>
                    <optgroup label="Europe">
                        <option value="Europe/Amsterdam">Amsterdam</option>
                        <option value="Europe/Berlin">Berlin</option>
                        <option value="Europe/Dublin">Dublin</option>
                        <option value="Europe/Lisbon">Lisbon</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Madrid">Madrid</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Europe/Rome">Rome</option>
                    </optgroup>
                </select>
                <br />
                <label htmlFor="datetime" className="f6 b db mb2">Datetime</label>
                <input type="datetime-local" id="datetime" name="datetime" defaultValue="1970-01-01T00:00" onChange={(e) => this.changeDatetime(e)} className="input-reset ba b--black-20 pa2 mb2 db w-100" />
                <br />
                <label htmlFor="epoch" className="f6 b db mb2">Epoch</label>
                <input type="number" id="epoch" name="epoch" readOnly={true} value={this.state.value} className="input-reset ba b--black-20 pa2 mb2 di w-80" />
                <button type="button" onClick={(e) => navigator.clipboard.writeText(`${this.state.value}`)} className="di w-20">Copy</button>
            </form>
        );
    }
};
