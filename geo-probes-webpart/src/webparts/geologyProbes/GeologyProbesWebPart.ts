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
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions
} from '@microsoft/sp-http';

import { 
  escape 
} from '@microsoft/sp-lodash-subset';

import styles from './GeologyProbesWebPart.module.scss';
import * as strings from 'GeologyProbesWebPartStrings';
import MockSharePointClient from './Mocks/MockSPClient';

import { 
  ISPListItem,
  ISPList
} from './DataModels/ISPListItem';

export interface IGeologyProbesWebPartProps {
  description: string;
}

export default class GeologyProbesWebPart extends BaseClientSideWebPart<IGeologyProbesWebPartProps> {

  public render(): void {

    this.domElement.innerHTML = 
    `
      <div class="AndriiSyngaivskyi-ListCheckAndCreate"></div>
      <div class="AndriiSyngaivskyi-SystemInfo"></div>
      <hr/>
      <div>
        <h3 class="${styles.headerH3}">Доступные списки</h3>
        <ul class="AndriiSyngaivskyi-Lists ${styles.container}"></ul>
      </div>
      <br/>
      <div>
        <h3 class="${styles.headerH3}">Элементы выбранного списка</h3>
        <ul class="AndriiSyngaivskyi-ListItems"></ul>
      </div>
    `;  
    this._renderListCreation(); 
    this._renderLists();    
  }

  private _renderListCreation() {
    let divTargetElement : HTMLDivElement =           
      this.domElement
      .getElementsByClassName("AndriiSyngaivskyi-ListCheckAndCreate")[0] as HTMLDivElement;
    
    divTargetElement.innerHTML =        
    `
      <h3  class="${styles.headerH3}">Управление списком</h3>
      <div class="${styles.container}">
          <input type="text" class="${styles.input} AndriiSyngaivskyi-ListNameInput" placeholder="Имя списка...">
          <button type='button' class='${styles.button} AndriiSyngaivskyi-CheckListButton'>
              <span class='ms-Button-label'>Check</span>
          </button>
          <button type='button' class='${styles.button} AndriiSyngaivskyi-CreateListButton'>
              <span class='ms-Button-label'>Create</span>
          </button>
          <button type='button' class='${styles.button} AndriiSyngaivskyi-DeleteListButton'>
              <span class='ms-Button-label'>Delete</span>
          </button>
      </div>
    `; 

    this._listNameInputHendler = this._listNameInputHendler.bind(this);     
    const listNameInput: HTMLInputElement = 
            this.domElement
            .getElementsByClassName("AndriiSyngaivskyi-ListNameInput")[0] as HTMLInputElement;      
    listNameInput.addEventListener("keyup", this._listNameInputHendler);
    listNameInput.addEventListener("click", this._listNameInputHendler);

    this._checkSharePointList = this._checkSharePointList.bind(this);     
    const buttonCheck: HTMLButtonElement = 
            this.domElement
            .getElementsByClassName("AndriiSyngaivskyi-CheckListButton")[0] as HTMLButtonElement;      
    buttonCheck.addEventListener("click", this._checkSharePointList);

    this._createSharePointList = this._createSharePointList.bind(this);     
    const buttonCreate: HTMLButtonElement = 
            this.domElement
            .getElementsByClassName("AndriiSyngaivskyi-CreateListButton")[0] as HTMLButtonElement;  
    buttonCreate.addEventListener("click", this._createSharePointList);

    this._deleteSharePointList = this._deleteSharePointList.bind(this);      
    const buttonDelete: HTMLButtonElement = 
            this.domElement
            .getElementsByClassName("AndriiSyngaivskyi-DeleteListButton")[0] as HTMLButtonElement;      
    buttonDelete.addEventListener("click", this._deleteSharePointList);

    buttonCheck.disabled = true;
    buttonCreate.disabled = true;
    buttonDelete.disabled = true;
  }

  private _listNameInputHendler(event: Event): void {

    const listNameInput: HTMLInputElement = 
            this.domElement
            .getElementsByClassName("AndriiSyngaivskyi-ListNameInput")[0] as HTMLInputElement;

    const buttonCheck: HTMLButtonElement = 
            this.domElement
            .getElementsByClassName("AndriiSyngaivskyi-CheckListButton")[0] as HTMLButtonElement; 
    
    const buttonCreate: HTMLButtonElement = 
            this.domElement
            .getElementsByClassName("AndriiSyngaivskyi-CreateListButton")[0] as HTMLButtonElement;
    
    const buttonDelete: HTMLButtonElement = 
            this.domElement
            .getElementsByClassName("AndriiSyngaivskyi-DeleteListButton")[0] as HTMLButtonElement;   

    if (listNameInput.value !== null && listNameInput.value !== "" && listNameInput.value.length > 3) {
      buttonCheck.disabled = false;
      buttonCreate.disabled = false;
      buttonDelete.disabled = false;
    } else {
      buttonCheck.disabled = true;
      buttonCreate.disabled = true;
      buttonDelete.disabled = true;
    }
  }

  private _checkSharePointList(event: Event): void {

    const listNameInput: HTMLInputElement = 
            this.domElement
            .getElementsByClassName("AndriiSyngaivskyi-ListNameInput")[0] as HTMLInputElement;
    
    const listNameAlerts: HTMLDivElement = 
            this.domElement
            .getElementsByClassName("AndriiSyngaivskyi-SystemInfo")[0] as HTMLDivElement;

    const getListUrl: string = 
            this.context.pageContext.web.absoluteUrl + 
            "/_api/web/lists/GetByTitle('" + 
            listNameInput.value + 
            "')"; 
    
    this.context.spHttpClient
      .get(getListUrl, SPHttpClient.configurations.v1)  
      .then( 
        (response: SPHttpClientResponse) => 
        { 
          let listExists = (response.status === 200 ) ? true : false;

          listNameAlerts.innerHTML = 
          `
            <p>Список с именем  
              ${listNameInput.value} - ${ (listExists) ? 
                "существует. Можете его удалить." : 
                "не существует. Можете его создать." }
            </p>
          `;
        }
    ); 
    
    setTimeout( (_listNameAlerts) => { _listNameAlerts.innerHTML = ""; }, 3000, listNameAlerts );
  }

  private _createSharePointList(event: Event): void {

    const listNameInput: HTMLInputElement = 
        this.domElement
        .getElementsByClassName("AndriiSyngaivskyi-ListNameInput")[0] as HTMLInputElement;

    const listNameAlerts: HTMLDivElement = 
        this.domElement
        .getElementsByClassName("AndriiSyngaivskyi-SystemInfo")[0] as HTMLDivElement;

    const getListUrl: string = 
            this.context.pageContext.web.absoluteUrl + 
            "/_api/web/lists/GetByTitle('" +
            listNameInput.value + 
            "')" ;  
    
    this.context.spHttpClient
      .get(getListUrl, SPHttpClient.configurations.v1)  
      .then( 
        (response: SPHttpClientResponse) => 
        {      
          if (response.status === 404) 
          {        
            const url: string = 
                    this.context.pageContext.web.absoluteUrl + 
                    "/_api/web/lists";  

            const listDefinition : any = 
            {                
              "Title": listNameInput.value,                
              "Description": "List description",                
              "AllowContentTypes": true,                
              "BaseTemplate": 100,                
              "ContentTypesEnabled": true,        
            };   

            const spHttpClientOptions: ISPHttpClientOptions = 
            {            
              "body": JSON.stringify(listDefinition)        
            }; 

            this.context.spHttpClient
              .post(url, SPHttpClient.configurations.v1, spHttpClientOptions)          
              .then(
                (response: SPHttpClientResponse) => 
                {            
                  if (response.status === 201) 
                  {              
                    listNameAlerts.innerHTML = 
                    `
                      <p>Список с именем  
                        ${listNameInput.value} - успешно создан.
                      </p>
                    `;

                    this._renderLists();              
                  } else {              
                    listNameAlerts.innerHTML = 
                    `
                      <p>Не удалось создать список с именем  
                        ${listNameInput.value}, почему-то...
                      </p>
                    `;           
                  }          
                }
            );
          } else {
            listNameAlerts.innerHTML = 
            `
              <p>Возможно, что список с именем  
                ${listNameInput.value} - уже существует...
              </p>
            `;
          }          
        }
    ); 

    setTimeout( (_listNameAlerts) => { _listNameAlerts.innerHTML = ""; }, 3000, listNameAlerts );
  }

  private _deleteSharePointList(event: Event): void {

    const listNameInput: HTMLInputElement = 
            this.domElement
            .getElementsByClassName("AndriiSyngaivskyi-ListNameInput")[0] as HTMLInputElement;

    const listNameAlerts: HTMLDivElement = 
            this.domElement
            .getElementsByClassName("AndriiSyngaivskyi-SystemInfo")[0] as HTMLDivElement;

    const getListUrl: string = 
            this.context.pageContext.web.absoluteUrl + 
            "/_api/web/lists/GetByTitle('" +
            listNameInput.value + 
            "')" ;

    this.context.spHttpClient
      .get(getListUrl, SPHttpClient.configurations.v1)  
      .then( 
        (response: SPHttpClientResponse) => 
        {      
          if (response.status === 200) 
          {         
            const spHttpClientOptions: ISPHttpClientOptions = 
                    {            
                      headers: {
                        "Accept": "application/json;odata=verbose",  
                        "IF-MATCH": "*",
                        "X-HTTP-Method": "DELETE"
                      } 
                    }; 
            this.context.spHttpClient
                    .post(getListUrl, SPHttpClient.configurations.v1, spHttpClientOptions)          
                    .then(
                      (response: SPHttpClientResponse) => 
                      {  
                        if (response.status === 406) 
                        {              
                          listNameAlerts.innerHTML = 
                          `
                            <p>Список с именем  
                              ${listNameInput.value} - удален. Но его пока еще можно восстановить.
                            </p>
                          `;
                          this._renderLists();              
                        } else {
                          listNameAlerts.innerHTML = 
                          `
                            <p>Список с именем  
                              ${listNameInput.value} - во время операции удаления произошел сбой...
                            </p>
                          `;                          
                        }
                      }
                    );
          } else {
            listNameAlerts.innerHTML = 
            `
              <p>Список с именем  
                ${listNameInput.value} - не был найден, почему-то...
              </p>
            `;            
          }
        }
    ); 

    setTimeout( (_listNameAlerts) => { _listNameAlerts.innerHTML = ""; }, 3000, listNameAlerts );
  }
  
  private _renderLists(): void {

    let itemsStr : string = "";  
    let ulTargetElement : HTMLUListElement =           
          this.domElement
          .getElementsByClassName("AndriiSyngaivskyi-Lists")[0] as HTMLUListElement;

    this._getLists().then(
      list => 
      {            
        list.forEach( 
          item => 
          {      
            itemsStr += 
            `      
              <li class="AndriiSyngaivskyi-ListAsItem ${styles.infoBlock}"
                  style="list-style-image: url(${item.ImageUrl})">
                <span class="AndriiSyngaivskyi-ItemTitle"> ${item.Title}</span>
                <br/>        
                ID: <span class="AndriiSyngaivskyi-ItemId"> ${item.Id}</span>
                <br/>        
                Last Modified Date: ${item.LastItemUserModifiedDate}     
                <hr/>
              </li>
            `;
          }
        );

        ulTargetElement.innerHTML = itemsStr;  
        
        this.handleListItemClick = this.handleListItemClick.bind(this);

        const listElements : HTMLCollectionOf<HTMLLIElement> = 
          this.domElement
          .getElementsByClassName("AndriiSyngaivskyi-ListAsItem") as HTMLCollectionOf<HTMLLIElement>; 

        [].forEach.call(
          listElements, 
          (element : HTMLLIElement) => element.addEventListener('click', this.handleListItemClick, true)
        );
      }
    );
  }

  private handleListItemClick(event: Event): void {

    let idSrcElement : HTMLSpanElement = 
          (event.srcElement as HTMLLIElement)
          .getElementsByClassName("AndriiSyngaivskyi-ItemId")[0] as HTMLSpanElement;
    let titleSrcElement : HTMLSpanElement = 
          (event.srcElement as HTMLLIElement)
          .getElementsByClassName("AndriiSyngaivskyi-ItemTitle")[0] as HTMLSpanElement;
    let listItemtemId = idSrcElement.innerText;
    let listItemtemTitle = titleSrcElement.innerText;

    let targetForListSelected : HTMLInputElement = 
          this.domElement
          .getElementsByClassName("AndriiSyngaivskyi-ListNameInput")[0] as HTMLInputElement;
    targetForListSelected.value = listItemtemTitle;

    const listNameAlerts: HTMLDivElement = 
          this.domElement
          .getElementsByClassName("AndriiSyngaivskyi-SystemInfo")[0] as HTMLDivElement;
    listNameAlerts.innerHTML =
    `
      <p>GUID списка: ${listItemtemId}</p>
    `;
    setTimeout( (_listNameAlerts) => { _listNameAlerts.innerHTML = ""; }, 3000, listNameAlerts );

    let targetForListItems : HTMLUListElement = 
        this.domElement
        .getElementsByClassName("AndriiSyngaivskyi-ListItems")[0] as HTMLUListElement;

    let itemsStr : string = "";         
    this._getListItems(listItemtemId).then(
      items => 
      {
        items.forEach( 
          item => 
          {      
            itemsStr += `<li>Id:${item.Id} - ${item.Title}</li>`;
          }
        );

        targetForListItems.innerHTML = itemsStr;
      }      
    );
  }

  private _getListItems(itemId : string): Promise<ISPListItem[]> {  
    if (Environment.type === EnvironmentType.Local) {    
      return this._getMockListData(itemId);  
    } else {    
      return this._getSharePointListData(itemId);  
    } 
  }

  private _getSharePointListData(itemId : string): Promise<ISPListItem[]> {
    const url: string = 
      this.context.pageContext.site.absoluteUrl + 
        "/_api/web/lists(guid'" + itemId + "')/items";  

    return this.context.spHttpClient
      .get( url, SPHttpClient.configurations.v1 )     
      .then(
        response => 
        {        
          return response.json();      
        }
      )    
      .then(
        json => 
        {      
          return json.value;    
        }
      ) as Promise<ISPListItem[]>; 
  }

  private _getMockListData(itemId : string): Promise<ISPListItem[]> {  
    return MockSharePointClient.getListItems("")    
      .then(
        (data: ISPListItem[]) => {          
          return data;      
        }
      ); 
  }

  private _getLists(): Promise<ISPList[]> {  
    if (Environment.type === EnvironmentType.Local) {    
      return this._getMockLists();  
    } else {    
      return this._getSharePointLists();  
    } 
  }

  private _getSharePointLists(): Promise<ISPList[]> {    
    const url: string = this.context.pageContext.web.absoluteUrl + "/_api/web/lists";    
    return this.context.spHttpClient
      .get( url, SPHttpClient.configurations.v1 )      
      .then( 
        response => 
        {        
          return response.json();      
        }
      )    
      .then(
        json => 
        {      
          return json.value;    
        }
      ) as Promise<ISPList[]>; 
    } 

  private _getMockLists(): Promise<ISPList[]> {  
    return MockSharePointClient.getLists("")    
      .then(
        (data: ISPList[]) => {          
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
