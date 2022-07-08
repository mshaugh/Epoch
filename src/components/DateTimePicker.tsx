import React from "react";

import {createStyles, Grid, Indicator} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import {DatePicker, TimeInput} from "@mantine/dates";

import dayjs from "dayjs";

const useStyles = createStyles((theme) => ({
    weekend: {
        color: `${theme.colors.blue[6]} !important`,
    },

    selected: {
        color: `${theme.white} !important`,
    },
}));

type DateTimePickerProps = {
    date: Date,
    setDate: (value: Date | React.ChangeEvent<any> | null | undefined) => void,
    time: Date,
    setTime: (value: Date | React.ChangeEvent<any> | null | undefined) => void,
};

export default function DateTimePicker({ date, setDate, time, setTime }: DateTimePickerProps) {
    const isMobile = useMediaQuery("(max-width: 576px)");
    const { classes, cx } = useStyles();

    return (
        <Grid>
            <Grid.Col span={8}>
                <DatePicker
                    label="Date"
                    required
                    clearable={false}
                    value={date}
                    onChange={setDate}
                    dropdownType={isMobile ? "modal" : "popover"}
                    dayClassName={(date, modifiers) =>
                        cx({
                            [classes.weekend]: modifiers.weekend,
                            [classes.selected]: modifiers.selected,
                        })
                    }
                    renderDay={(date) => {
                        const today = dayjs(date).isToday();
                        const day = date.getDate();
                        return today
                            ? <Indicator position="top-center" size={isMobile ? 8 : 4} offset={isMobile ? 10 : 8}>{day}</Indicator>
                            : day
                    }}
                />
            </Grid.Col>
            <Grid.Col span={4}>
                <TimeInput
                    label="Time"
                    required
                    value={time}
                    onChange={setTime}
                />
            </Grid.Col>
        </Grid>
    );
}