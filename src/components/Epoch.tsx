import React, {useEffect, useState} from 'react';

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

const dtf = (epoch: dayjs.Dayjs, options: any, tz?: string) => {
    return new Intl.DateTimeFormat(
        tz ? Object.assign({}, ...Object.values(TIMEZONES))[tz.substring(tz.indexOf('/')+1)] : [],
        { timeZone: tz, ...options }
    ).format(epoch.toDate());
}

const DISCORD_STYLES: { [format: string]: { description: string; formatOptions?: any; format(epoch: dayjs.Dayjs, tz?: string): string; } } = {
    t: {
        description: "Short Time",
        formatOptions: { hour: '2-digit', minute: '2-digit' },
        format: function(epoch: dayjs.Dayjs, tz?: string) { return dtf(epoch, this.formatOptions, tz); },
    },
    T: {
        description: "Long Time",
        formatOptions: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
        format: function(epoch: dayjs.Dayjs, tz?: string) { return dtf(epoch, this.formatOptions, tz); },
    },
    d: {
        description: "Short Date",
        formatOptions: { year: 'numeric', month: '2-digit', day: '2-digit' },
        format: function(epoch: dayjs.Dayjs, tz?: string) { return dtf(epoch, this.formatOptions, tz); },
    },
    D: {
        description: "Long Date",
        formatOptions: { year: 'numeric', month: 'long', day: '2-digit' },
        format: function(epoch: dayjs.Dayjs, tz?: string) { return dtf(epoch, this.formatOptions, tz); },
    },
    f: {
        description: "Short Date/Time",
        formatOptions: { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' },
        format: function(epoch: dayjs.Dayjs, tz?: string) { return dtf(epoch, this.formatOptions, tz); },
    },
    F: {
        description: "Long Date/Time",
        formatOptions: { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' },
        format: function(epoch: dayjs.Dayjs, tz?: string) { return dtf(epoch, this.formatOptions, tz); },
    },
    R: {
        description: "Relative Time",
        format: (epoch: dayjs.Dayjs) => { return epoch.fromNow(); },
    }
};

export default function Epoch() {
    const _d: dayjs.Dayjs = dayjs().millisecond(0).second(0).minute(0).hour(0);

    const [discordStyle, setDiscordStyle] = useState("f");
    const [datetime, rawSetDatetime] = useState(_d.format("YYYY-MM-DDTHH:mm"));
    const setDatetime = (value: string) => {
        if (value) {
            rawSetDatetime(value);
        }
    };
    const [epoch, setEpoch] = useState(_d.tz("America/New_York", true));
    const [timezone, setTimezone] = useState("America/New_York");
    useEffect(() => {
        setEpoch(dayjs(datetime).tz(timezone, true));
    }, [datetime, timezone]);

    return (
        <form>
            <div className="db w-100 mb4">
                <label htmlFor="timezone" className="f6 b db mb2">Timezone</label>
                <select id="timezone" name="timezone" defaultValue="America/New_York" onChange={(e) => setTimezone(e.target.value)} className="ba b--black-20 pa2 mb2 db w-100">
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
                <input type="datetime-local" id="datetime" name="datetime" defaultValue={datetime} onChange={(e) => setDatetime(e.target.value)} className="input-reset ba b--black-20 pa2 mb2 db w-100" />
            </div>
            <div className="db w-100 mb4">
                <label htmlFor="epoch" className="f6 b db mb2">Epoch</label>
                <input type="number" id="epoch" readOnly={true} value={epoch.utc().unix()} className="input-reset ba b--black-20 pa2 mb2 di w-80" />
                <button type="button" onClick={() => navigator.clipboard.writeText(``)} className="di w-20">Copy</button>
            </div>
            <hr />
            <div className="db w-100 mt4 mb4">
                <label htmlFor="discord-style" className="f6 b db mb2">Discord Style</label>
                <select id="discord-style" name="discord-style" defaultValue={discordStyle} onChange={(e) => setDiscordStyle(e.target.value)} className="ba b--black-20 pa2 mb2 db w-100">
                    {
                        Object.entries(DISCORD_STYLES).map(x => (
                            <option key={x[0]} value={x[0]}>{x[1].description}</option>
                        ))
                    }
                </select>
            </div>
            <div className="db w-100 mb4">
                <label htmlFor="discord" className="f6 b db mb2">Discord</label>
                <input type="text" id="discord" name="discord" readOnly={true} value={`<t:${epoch.utc().unix()}:${discordStyle}>`} className="input-reset ba b--black-20 pa2 mb2 di w-80" />
                <button type="button" onClick={() => navigator.clipboard.writeText(`<t:${epoch.utc().unix()}:${discordStyle}>`)} className="di w-20">Copy</button>
            </div>
            <div className="db w-100 mb4">
                <label htmlFor="discord-rendered" className="f6 b db mb2">Rendered Output ({timezone})</label>
                <input type="text" id="discord-rendered" name="discord-rendered" readOnly={true} value={DISCORD_STYLES[discordStyle].format(epoch, timezone)} className="input-reset ba b--black-20 pa2 mb2 db w-100" />
            </div>
            { timezone !== Intl.DateTimeFormat().resolvedOptions().timeZone && (
                <div className="db w-100 mb4">
                    <label htmlFor="discord-rendered-local" className="f6 b db mb2">Rendered Output ({Intl.DateTimeFormat().resolvedOptions().timeZone})</label>
                    <input type="text" id="discord-rendered-local" name="discord-rendered-local" readOnly={true} value={DISCORD_STYLES[discordStyle].format(epoch)} className="input-reset ba b--black-20 pa2 mb2 db w-100" />
                </div>
            )}

            <style jsx>{`
                input:invalid {
                  outline: red auto 1px;
                }   
            `}</style>
        </form>

    );
}