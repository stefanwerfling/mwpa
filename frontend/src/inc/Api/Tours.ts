import {NetFetch} from '../Net/NetFetch';
import {UnauthorizedError} from './Error/UnauthorizedError';
import {StatusCodes} from './Status/StatusCodes';
import {DefaultReturn} from './Types/DefaultReturn';

/**
 * ToursFilter
 */
export type ToursFilter = {
    year?: number;
    limit?: number;
    offset?: number;
};

/**
 * TourEntry
 */
export type TourEntry = {
    id: number;
    tour_fid: string;
    creater_id: number;
    create_datetime: number;
    update_datetime: number;
    vehicle_id: number;
    vehicle_driver_id: number;
    beaufort_wind: string;
    date: string;
    tour_start: string;
    tour_end: string;
    organization_id: number;
    status: number;
    record_by_persons: string;
    count_sightings: number;
    count_trackings: number;
};

/**
 * ToursResponse
 */
export type ToursResponse = DefaultReturn & {
    filter?: ToursFilter;
    offset?: number;
    count?: number;
    list?: TourEntry[];
};

/**
 * Tour
 */
export class Tours {

    /**
     * getList
     */
    public static async getList(filter?: ToursFilter): Promise<ToursResponse|null> {
        let data = {};

        if (filter) {
            data = filter;
        }

        const result = await NetFetch.postData('/json/tours/list', data);

        if (result && result.statusCode) {
            switch (result.statusCode) {
                case StatusCodes.OK:
                    return result as ToursResponse;

                case StatusCodes.UNAUTHORIZED:
                    throw new UnauthorizedError();
            }
        }

        return null;
    }

}