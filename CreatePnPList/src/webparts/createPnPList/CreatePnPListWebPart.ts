import { Web } from "sp-pnp-js";

import { Version } from '@microsoft/sp-core-library';

import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import { escape } from '@microsoft/sp-lodash-subset';

import styles from './CreatePnPListWebPart.module.scss';
import * as strings from 'CreatePnPListWebPartStrings';

export interface ICreatePnPListWebPartProps {
  description: string;
}

export default class CreatePnPListWebPart extends BaseClientSideWebPart<ICreatePnPListWebPartProps> {

  private CreateList(): void { 

    let spWeb = new Web(this.context.pageContext.web.absoluteUrl);
    let spListTitle = "SPFxPnPList";
    let spListDescription = "SPFxPnP List";
    let spListTemplateId = 100;
    let spEnableCT = false;

    spWeb.lists
      .add(spListTitle, spListDescription,spListTemplateId, spEnableCT)
        .then( 
          function(splist){
            document.getElementById("ListCreationStatus").innerHTML += `New List: ${spListTitle} Created`;
          }
        );
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.createPnPList}">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span class="ms-font-xl ms-fontColor-white" style="font-size:28px">
                Welcome to SharePoint Framework Development using PnP JS Library
              </span>
              <p class="ms-font-l ms-fontColor-white" style="text-align: left">
                Demo : Create SharePoint List
              </p>
            </div>
          </div> 
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div style="background-color:Black;color:white;text-align: center;font-weight: bold;font-size:18px;">
              Employee Details
            </div><br>
            <div id="ListCreationStatus"></div>
          </div>
        </div>
      </div>
    `;
    this.CreateList(); 
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
