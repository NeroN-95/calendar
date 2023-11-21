import moment from "moment/moment";
import {CellWrapper, RowCell} from "../containers/index.js";
export const CalendarGridHeader = () => {
    return (
        <>

            {[...Array(7)].map((_, i) => (
                <CellWrapper isHeader isSelectedMon key={i}>
                    <RowCell
                        justifyContent={'flex-end'} pr={1}

                    >

                        {moment().day(i + 1).format('ddd')}
                    </RowCell>

                </CellWrapper>
            ))}
        </>
    );
};