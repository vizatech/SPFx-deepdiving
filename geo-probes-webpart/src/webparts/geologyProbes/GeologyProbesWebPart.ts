import { 
  Version,
  Environment,
  EnvironmentType 
} from '@microsoft/sp-core-library';

import {
  IPropertyPaneConfiguration,  
  BaseClientSideWebPart,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import { 
  escape 
} from '@microsoft/sp-lodash-subset';

import styles from './GeologyProbesWebPart.module.scss';
import * as strings from 'GeologyProbesWebPartStrings';
import MockSharePointClient from './Mocks/MockSPClient';
import { 
  ISPListItem 
} from './DataModels/ISPListItem';


export interface IGeologyProbesWebPartProps {
  description: string;
}

export default class GeologyProbesWebPart extends BaseClientSideWebPart<IGeologyProbesWebPartProps> {

  public render(): void {
    let listItemsStr : string = "";  
    this._getListItems().then(
      listItems => 
      {    
        listItems.forEach( 
          listItem => 
          {      
            listItemsStr += `      
              <li>${listItem.Id} - ${listItem.Title}</li>      
            `;    
          }
        );    
        this.domElement.innerHTML = `
          <h3>List items</h3>
          <ul>${listItemsStr}</li>
        `;  
      }
    ); 
  }

  private _getListItems(): Promise<ISPListItem[]> {  
    if (Environment.type === EnvironmentType.Local) {    
      return this._getMockListData();  
    } else {    
      alert("TODO: Implement real thing here");    
      return null;  
    } 
  }

  private _getMockListData(): Promise<ISPListItem[]> {  
    return MockSharePointClient.get("")    
      .then(
        (data: ISPListItem[]) => {          
          return data;      
        }
      ); 
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
