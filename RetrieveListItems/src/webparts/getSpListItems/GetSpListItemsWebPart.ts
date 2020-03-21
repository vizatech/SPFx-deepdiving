import {
  BaseClientSideWebPart,
} from '@microsoft/sp-webpart-base';

import {  
  PropertyPaneTextField,
  IPropertyPaneConfiguration
} from '@microsoft/sp-property-pane';

import { 
  Version,
  Environment, 
  EnvironmentType 
} from '@microsoft/sp-core-library'; 

import { 
  SPHttpClient 
} from '@microsoft/sp-http'; 

import * as strings from 'GetSpListItemsWebPartStrings';

import styles from './GetSpListItemsWebPart.module.scss';

import MockHttpClient from './MockHttpClient';

export interface IGetSpListItemsWebPartProps {
  description: string;
  environment: string;
}

export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  EmployeeId: string;
  EmployeeName: string;
  Experience: string;
  Location: string;
}

export default class GetSpListItemsWebPart extends BaseClientSideWebPart<IGetSpListItemsWebPartProps> 
{
  public render(): void {
    this.domElement.innerHTML = `
    <div class="${styles.getSpListItems}"> 
      <div class="${styles.container}"> 
        <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
          <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
            <span class="ms-font-xl ms-fontColor-white" style="font-size:28px">
              Тестируем работу SPFx
            </span>
            <p class="ms-font-l ms-fontColor-white" style="text-align: center">
              Demo : Получаем данные о сотрудниках из списка SharePoint ${this.properties.environment}
            </p>
          </div>
        </div>
        <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}"> 
          <div style="background-color:Black;color:white;text-align: center;font-weight:bold;font-size:18px;">
            Список сотрудников
          </div> 
          <br /> 
          <div id="spListContainer">
          </div>
        </div>
      </div>      
    </div>`;
    this._renderListAsync();
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

  private _getMockListData(): Promise<ISPLists> {
    return MockHttpClient
      .get(
        this.context.pageContext.web.absoluteUrl
      )
      .then( 
        (response) => { return response; }
      ); 
  }

  private _getSPListData(): Promise<ISPLists> {
    return this.context.spHttpClient
      .get( 
        this.context.pageContext.web.absoluteUrl + "/_api/web/lists/GetByTitle('EmployeeList')/Items",
        SPHttpClient.configurations.v1
      )
      .then( 
        (response) => { return response.json(); }
      );
  }

  private _renderListAsync(): void {
    if (Environment.type === EnvironmentType.Local) {  
      this._getMockListData().then( (response) => { this._renderList(response.value); });
      this.properties.environment = "(тестовый список)";
    } else { 
      this._getSPListData().then( (response) => { this._renderList(response.value); });
      this.properties.environment = "(список портала)";
    }
  }

  private _renderList(items: ISPList[]): void { 
    let html = '<table class="TFtable" border=1 width=100% style="border-collapse: collapse;">'; 
    html += `
      <th>EmployeeId</th>
      <th>EmployeeName</th>
      <th>Experience</th>
      <th>Location</th>
    `; 
    items.forEach( (item: ISPList) => {
      html += `
        <tr>
          <td>${item.EmployeeId}</td>
          <td>${item.EmployeeName}</td>
          <td>${item.Experience}</td>
          <td>${item.Location}</td>
        </tr>
      `;      
    });
    html += '</table>';
    
    const listContainer: HTMLTableElement = this.domElement.querySelector('#spListContainer'); 
    listContainer.innerHTML = html;
  }
}
