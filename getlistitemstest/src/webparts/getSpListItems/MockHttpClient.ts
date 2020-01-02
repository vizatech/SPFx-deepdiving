import { ISPList } from "./GetSpListItemsWebPart";

export default class MockHTTPClient {

    private static _items: ISPList[] = [
        { EmployeeId: '22-05-2018', EmployeeName: 'Олег Нестеров', Experience: '10 лет', Location:'Россия' },
    ]; 

    public static get(restUrl: string, options?: any): Promise<ISPList[]> {
        return new Promise<ISPList[]>( (resolve) => { 
            resolve(MockHTTPClient._items); 
        });
    }
}