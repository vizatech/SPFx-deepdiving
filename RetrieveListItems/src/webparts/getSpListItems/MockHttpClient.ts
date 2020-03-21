import { ISPList, ISPLists } from "./GetSpListItemsWebPart";

export default class MockHTTPClient {

    private static _items: ISPLists = {
            value: [
                { EmployeeId: '22-05-2018', EmployeeName: 'Олег Нестеренко', Experience: '10 лет', Location:'Россия' },
                { EmployeeId: '20-10-2017', EmployeeName: 'Сергей Невинный', Experience: '4 лет', Location:'Беларусь' },
                { EmployeeId: '05-05-2016', EmployeeName: 'Варвара Беленькая', Experience: '7 лет', Location:'Россия' },
                { EmployeeId: '13-05-2018', EmployeeName: 'Максим Всегда', Experience: '2 лет', Location:'Украина' },
                { EmployeeId: '25-05-2019', EmployeeName: 'Галина Вчерашняя', Experience: '8 лет', Location:'Россия' },  
         ]
    }; 

    public static get(restUrl: string, options?: any): Promise<ISPLists> {
        return new Promise<ISPLists>( (resolve) => { 
            resolve(MockHTTPClient._items); 
        });
    }
}