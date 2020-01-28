
import { 
    ISPListItem,
    ISPList 
} from '../DataModels/ISPListItem';

export default class MockSharePointClient {

    private static _listItems: ISPListItem[] = [
        { Id : 1, Title : "ListItem Title 1" },
        { Id : 2, Title : "ListItem Title 2" },
        { Id : 3, Title : "ListItem Title 3" },
        { Id : 4, Title : "ListItem Title 4" },
        { Id : 5, Title : "ListItem Title 5" },
    ];

    private static _listOfLists: ISPList[] = [
        { Id : "11111-2222", Title : "List Title 1", LastItemUserModifiedDate : "20.03.2020", ImageUrl: "Assets/andrii16x16.gif" },
        { Id : "22222-2222", Title : "List Title 2", LastItemUserModifiedDate : "22.07.2020", ImageUrl: "Assets/andrii16x16.gif" },
        { Id : "33333-2222", Title : "List Title 3", LastItemUserModifiedDate : "3.12.2020", ImageUrl: "Assets/andrii16x16.gif" },
        { Id : "44444-2222", Title : "List Title 4", LastItemUserModifiedDate : "30.04.2019", ImageUrl: "Assets/andrii16x16.gif" },
        { Id : "55555-2222", Title : "List Title 5", LastItemUserModifiedDate : "29.10.2020", ImageUrl: "Assets/andrii16x16.gif" },
    ];    

    public static getListItems( restUrl: string, options?: any) : Promise<ISPListItem[]> {
        return  new Promise<ISPListItem[]>(
            (resolve) => 
            {            
                resolve( MockSharePointClient._listItems );
            }    
        );
    }

    public static getLists( restUrl: string, options?: any) : Promise<ISPList[]> {
        return  new Promise<ISPList[]>(
            (resolve) => 
            {            
                resolve( MockSharePointClient._listOfLists );
            }    
        );
    }
}