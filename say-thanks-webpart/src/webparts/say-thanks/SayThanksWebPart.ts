import { 
  Version,
  Environment, 
  EnvironmentType 
} from '@microsoft/sp-core-library';

import {
  BaseClientSideWebPart
} from '@microsoft/sp-webpart-base';

import {  
  PropertyPaneTextField,
  IPropertyPaneConfiguration
} from '@microsoft/sp-property-pane';

import { 
  SPHttpClient, 
  SPHttpClientResponse, 
  ISPHttpClientOptions
} from '@microsoft/sp-http'; 

import { 
  escape 
} from '@microsoft/sp-lodash-subset';

import * as strings from 'SayThanksWebPartStrings';

import styles from './SayThanksWebPart.module.scss';

export interface ISayThanksWebPartProps {
  userName: string;
  wordsOfThanks: string;
}

export default class SayThanksWebPart 
                            extends BaseClientSideWebPart<ISayThanksWebPartProps> 
{

  public render(): void {
    this.domElement.innerHTML = `
      <div>
        <i class='ms-Icon ms-Icon--NoteForward' aria-hidden='true'></i>
        <input type='text' maxlenght='255'
          class='${ styles.input } username' 
          placeholder='${ escape(this.properties.userName) }' 
        />
        <br /><br />
        <i class='ms-Icon ms-Icon--NoteForward' aria-hidden='true'></i>
        <input type='text' maxlenght='255'
          class='${ styles.input } wordsofthanks' 
          placeholder='${ escape(this.properties.wordsOfThanks) }' 
        />
        <br /><br />
        <button type='button' class='ms-Button addThanks'>
          <span class='ms-Buttonlabel'>
            Отправить
          </span>
        </button>
        <br /><br />
        <button type='button' class='ms-Button getWebContext'>
          <span class='ms-Buttonlabel'>
            Получить данные контекста страницы
          </span>
        </button>
        <p class='${ styles.successIndicator }'></p>
      </div>
    `;

    this.selectUser = this.selectUser.bind(this);      
    const userNameInput: HTMLInputElement = 
                this.domElement.getElementsByClassName("username")[0] as HTMLInputElement;      
    userNameInput.addEventListener("keyup", this.selectUser);

    this.setComment = this.setComment.bind(this);      
    const textInput: HTMLInputElement = 
                this.domElement.getElementsByClassName("wordsofthanks")[0] as HTMLInputElement;      
    textInput.addEventListener("keyup", this.setComment);

    this.sendThanks = this.sendThanks.bind(this);      
    const buttonAddThanks: HTMLButtonElement = 
                this.domElement.getElementsByClassName("addThanks")[0] as HTMLButtonElement;      
    buttonAddThanks.onclick = this.sendThanks; 

    this.getWebContext = this.getWebContext.bind(this);      
    const buttonGetWebContext: HTMLButtonElement = 
                this.domElement.getElementsByClassName("getWebContext")[0] as HTMLButtonElement;      
    buttonGetWebContext.onclick = this.getWebContext; 

    this.buttonAddThanksDisabled(); 
  }

  private _userName: string = ''; 
  private _commentText: string = ''; 
  
  private selectUser(event: Event): void {    
    let srcElement: HTMLInputElement = event.srcElement as HTMLInputElement;    
    this._userName = escape(srcElement.value); 
    this.buttonAddThanksDisabled();
  }   
  
  private setComment(event: Event): void {    
    let srcElement: HTMLInputElement = event.srcElement as HTMLInputElement;    
    this._commentText = escape(srcElement.value); 
    this.buttonAddThanksDisabled();
  }  

  private buttonAddThanksDisabled(): void {
    const buttonAddThanks: 
      HTMLButtonElement = this.domElement.getElementsByClassName("addThanks")[0] as HTMLButtonElement;
    buttonAddThanks.disabled = ( (this._userName.length !== 0) && (this._commentText.length !== 0) )? false : true; 
  } 

  private sendThanks(): void {    
    
    this.context.statusRenderer.clearError(this.domElement); 
    
    const paragraphElement: HTMLParagraphElement = 
    this.domElement.getElementsByClassName(styles.successIndicator)[0] as HTMLParagraphElement;    
    paragraphElement.innerHTML = "";

    if ( this._commentText === undefined || 
              this._commentText.length === 0 || 
                  this._userName === undefined || 
                      this._userName.length === 0 ) {      
      this.context.statusRenderer.renderError(
        paragraphElement, "Поля формы не должны быть пустыми"
        );      
      return;    
    }

    if ( Environment.type === EnvironmentType.Local ) {      
      this.context.statusRenderer.renderError(
        paragraphElement, "Приложение находится в локальной среде разработки"
        );      
      return;    
    }

    this.context.statusRenderer.displayLoadingIndicator(
      paragraphElement, "... идет отправка сообщения ..."
    );

    const url: string = 
      this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('SayThanks')/items"; 

    const item : any = { 
      "UserName": this._userName,        
      "WordsOfThanks": this._commentText,          
      "FromURL": window.location.href    
    };   

    const spHttpClientOptions: ISPHttpClientOptions = {      
      "body": JSON.stringify(item)    
    }; 

    this.context.spHttpClient.post( 
      url, 
      SPHttpClient.configurations.v1, 
      spHttpClientOptions 
      ).then(
          (response: SPHttpClientResponse) => { 
                  this.context.statusRenderer.clearLoadingIndicator( paragraphElement );        
                  if (response.status === 201) { 
                    paragraphElement.innerHTML = 
                      "<i class='ms-Icon ms-Icon--Accept' ariahidden='true'>&nbsp;Данные успешно сохранены!</i>";        
                    } else {          
                      this.context.statusRenderer.renderError(
                        paragraphElement,            
                        `Ошибка передачи данных. Код ошибки: ${response.statusText} (${response.status})`
                      );        
                    }      
          }
      );  
  }

  private getWebContext(): void {    
    
    this.context.statusRenderer.clearError(this.domElement); 

    const paragraphElement: HTMLParagraphElement = 
                  this.domElement.getElementsByClassName(styles.successIndicator)[0] as HTMLParagraphElement;    
    paragraphElement.innerHTML = "";

    if ( Environment.type === EnvironmentType.Local ) {      
      this.context.statusRenderer.renderError(
        paragraphElement, "Приложение находится в локальной среде разработки"
        );      
      return;    
    }

    let url: string;

    if (this.context.pageContext.list === undefined || 
              this.context.pageContext.listItem === undefined) {
        this.context.statusRenderer.renderError(
          paragraphElement, 
          "Вы должны находиться на странице элемента списка, \nчто бы эта команда могла выполниться"
          );      
        return;
    } else {
    url = `
      ${this.context.pageContext.site.absoluteUrl}/_api/web/lists/
      getbytitle('${this.context.pageContext.list.title}')/
      items('${this.context.pageContext.listItem.id}')/
      FieldValuesAsHtml
      `; 
    }

    this.context.statusRenderer.displayLoadingIndicator(
      paragraphElement, "... идет получение данных ..."
    );

    this.context.spHttpClient.get( 
      url, 
      SPHttpClient.configurations.v1
      ).then(
          (response: SPHttpClientResponse) => { 
                  this.context.statusRenderer.clearLoadingIndicator( paragraphElement );        
                  if (response.status === 200) { 
                    return response.json();        
                    } else {          
                      this.context.statusRenderer.renderError(
                        paragraphElement,            
                        `Ошибка получения данных. Код ошибки: ${response.statusText} (${response.status})`
                      );        
                    }      
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
                PropertyPaneTextField('userName', {
                  label: strings.hintTextUserName
                }),
                PropertyPaneTextField('wordsOfThanks', {
                  label: strings.hintTextWordsOfThanks
                }), 
                            
              ]
            }
          ]
        }
      ]
    };    
  }

}
