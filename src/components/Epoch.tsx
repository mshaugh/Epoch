import React from 'react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONES: { [group: string]: { [timezone: string]: string } } = {
    "America": {
        "Los_Angeles": "en-US",
        "New_York": "en-US",
    },
    "Europe": {
        "Amsterdam": "nl-NL",
        "Berlin": "de-DE",
        "Dublin": "en-IE",
        "Lisbon": "pt-PT",
        "London": "en-GB",
        "Madrid": "es-ES",
        "Paris": "fr-FR",
        "Rome": "it-IT",
    }
};

const DISCORD_STYLES: { [format: string]: { description: string; format(epoch: dayjs.Dayjs, tz?: string): string; } } = {
    t: {
        description: "Short Time",
        format: (epoch: dayjs.Dayjs, tz?: string) => { return new Intl.DateTimeFormat(tz ? Object.assign({}, ...Object.values(TIMEZONES))[tz.substring(tz.indexOf('/')+1)] : [], { timeZone: tz, hour: '2-digit', minute: '2-digit' }).format(epoch.toDate()) },
    },
    T: {
        description: "Long Time",
        format: (epoch: dayjs.Dayjs, tz?: string) => { return new Intl.DateTimeFormat(tz ? Object.assign({}, ...Object.values(TIMEZONES))[tz.substring(tz.indexOf('/')+1)] : [], { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(epoch.toDate()) },
    },
    d: {
        description: "Short Date",
        format: (epoch: dayjs.Dayjs, tz?: string) => { return new Intl.DateTimeFormat(tz ? Object.assign({}, ...Object.values(TIMEZONES))[tz.substring(tz.indexOf('/')+1)] : [], { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(epoch.toDate()) },
    },
    D: {
        description: "Long Date",
        format: (epoch: dayjs.Dayjs, tz?: string) => { return new Intl.DateTimeFormat(tz ? Object.assign({}, ...Object.values(TIMEZONES))[tz.substring(tz.indexOf('/')+1)] : [], { timeZone: tz, year: 'numeric', month: 'long', day: '2-digit' }).format(epoch.toDate()) },
    },
    f: {
        description: "Short Date/Time",
        format: (epoch: dayjs.Dayjs, tz?: string) => { return new Intl.DateTimeFormat(tz ? Object.assign({}, ...Object.values(TIMEZONES))[tz.substring(tz.indexOf('/')+1)] : [], { timeZone: tz, year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(epoch.toDate()) },
    },
    F: {
        description: "Long Date/Time",
        format: (epoch: dayjs.Dayjs, tz?: string) => { return new Intl.DateTimeFormat(tz ? Object.assign({}, ...Object.values(TIMEZONES))[tz.substring(tz.indexOf('/')+1)] : [], { timeZone: tz, weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(epoch.toDate()) },
    },
    R: {
        description: "Relative Time",
        format: (epoch: dayjs.Dayjs) => { return epoch.fromNow(); },
    }
};

type EpochProps = {};

type EpochState = {
    datetime: string;
    discordStyle: string;
    epoch: dayjs.Dayjs;
    timezone: string;
};

export default class Epoch extends React.Component<EpochProps, EpochState> {
    default: dayjs.Dayjs = dayjs().millisecond(0).second(0).minute(0).hour(0);

    constructor(props: EpochProps) {
        super(props);

        this.state = {
            datetime: this.default.format('YYYY-MM-DDTHH:mm'),
            discordStyle: "f",
            epoch: this.default.tz("America/New_York", true),
            timezone: "America/New_York",
        };
    }

    changeDatetime(event: any) {
        this.setState({ datetime: event.target.value });
    }

    changeDiscordStyle(event: any) {
        this.setState({ discordStyle: event.target.value });
    }

    changeTimezone(event: any) {
        this.setState({ timezone: event.target.value });
    }

    renderedDiscordOutput(local: boolean): string {
        return local ? DISCORD_STYLES[this.state.discordStyle].format(this.state.epoch) : DISCORD_STYLES[this.state.discordStyle].format(this.state.epoch, this.state.timezone);
    }

    componentDidUpdate(prevProps: EpochProps, prevState: EpochState) {
        if (this.state.datetime !== prevState.datetime || this.state.timezone !== prevState.timezone) {
            const epoch = dayjs(this.state.datetime).tz(this.state.timezone, true);
            this.setState({ epoch: epoch });
        }
    }

    render() {
        return (
            <form>
                <div className="db w-100 mb4">
                    <label htmlFor="timezone" className="f6 b db mb2">Timezone</label>
                    <select id="timezone" name="timezone" defaultValue="America/New_York" onChange={(e) => this.changeTimezone(e)} className="ba b--black-20 pa2 mb2 db w-100">
                        {
                            Object.entries(TIMEZONES).map(x => (
                                <optgroup key={x[0]} label={x[0]}>
                                    {
                                        Object.entries(x[1]).map(y => (
                                            <option key={`${x[0]}/${y[0]}`} value={`${x[0]}/${y[0]}`}>{y[0].replace(/_/, " ")}</option>
                                        ))
                                    }
                                </optgroup>
                            ))
                        }
                    </select>
                </div>
                <div className="db w-100 mb4">
                    <label htmlFor="datetime" className="f6 b db mb2">Datetime</label>
                    <input type="datetime-local" id="datetime" name="datetime" defaultValue={this.state.datetime} onChange={(e) => this.changeDatetime(e)} className="input-reset ba b--black-20 pa2 mb2 db w-100" />
                </div>
                <div className="db w-100 mb4">
                    <label htmlFor="epoch" className="f6 b db mb2">Epoch</label>
                    <input type="number" id="epoch" name="epoch" readOnly={true} value={this.state.epoch.utc().unix()} className="input-reset ba b--black-20 pa2 mb2 di w-80" />
                    <button type="button" onClick={() => navigator.clipboard.writeText(`${this.state.epoch.utc().unix()}`)} className="di w-20">Copy</button>
                </div>

                <hr />
                <div className="db w-100 mt4 mb4">
                    <label htmlFor="discord-style" className="f6 b db mb2">Discord Style</label>
                    <select id="discord-style" name="discord-style" defaultValue="f" onChange={(e) => this.changeDiscordStyle(e)} className="ba b--black-20 pa2 mb2 db w-100">
                        {
                            Object.entries(DISCORD_STYLES).map(x => (
                                <option key={x[0]} value={x[0]}>{x[1].description}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="db w-100 mb4">
                    <label htmlFor="discord" className="f6 b db mb2">Discord</label>
                    <input type="text" id="discord" name="discord" readOnly={true} value={`<t:${this.state.epoch.utc().unix()}:${this.state.discordStyle}>`} className="input-reset ba b--black-20 pa2 mb2 di w-80" />
                    <button type="button" onClick={() => navigator.clipboard.writeText(`<t:${this.state.epoch.utc().unix()}:${this.state.discordStyle}>`)} className="di w-20">Copy</button>
                </div>
                <div className="db w-100 mb4">
                    <label htmlFor="discord-rendered" className="f6 b db mb2">Rendered Output ({this.state.timezone})</label>
                    <input type="text" id="discord-rendered" name="discord-rendered" readOnly={true} value={this.renderedDiscordOutput(false)} className="input-reset ba b--black-20 pa2 mb2 db w-100" />
                </div>
                { this.state.timezone !== Intl.DateTimeFormat().resolvedOptions().timeZone && (
                <div className="db w-100 mb4">
                    <label htmlFor="discord-rendered-local" className="f6 b db mb2">Rendered Output ({Intl.DateTimeFormat().resolvedOptions().timeZone})</label>
                    <input type="text" id="discord-rendered-local" name="discord-rendered-local" readOnly={true} value={this.renderedDiscordOutput(true)} className="input-reset ba b--black-20 pa2 mb2 db w-100" />
                </div>)
                }
            </form>
        );
    }
};
