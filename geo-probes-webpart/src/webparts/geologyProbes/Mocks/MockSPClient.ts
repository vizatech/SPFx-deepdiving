
import { 
    ISPListItem 
} from '../DataModels/ISPListItem';

export default class MockSharePointClient {

    private static _listItems: ISPListItem[] = [
        { Id : 1, Title : "List Title 1" },
        { Id : 2, Title : "List Title 2" },
        { Id : 3, Title : "List Title 3" },
        { Id : 4, Title : "List Title 4" },
        { Id : 5, Title : "List Title 5" },
    ];

    public static get( restUrl: string, options?: any) : Promise<ISPListItem[]> {
        return  new Promise<ISPListItem[]>(
            (resolve) => 
            {            
                resolve( MockSharePointClient._listItems );
            }    
        );
    }
}