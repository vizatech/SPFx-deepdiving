import * as pnp from 'sp-pnp-js';

import { Version } from '@microsoft/sp-core-library';

import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './GetUserProfilePropertiesWebPart.module.scss';
import * as strings from 'GetUserProfilePropertiesWebPartStrings';

export interface IGetUserProfilePropertiesWebPartProps {
  description: string;
}

export default class GetUserProfilePropertiesWebPart extends BaseClientSideWebPart<IGetUserProfilePropertiesWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.getUserProfileProperties}">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span class="ms-font-xl ms-fontColor-white" style="font-size:28px">
                Welcome to SharePoint Framework Development using PnP JS Library
              </span>
              <p class="ms-font-l ms-fontColor-white" style="text-align: left">
                Demo : Retrieve User Profile Properties
              </p>
            </div>
          </div>
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div style="background-color:Black;color:white;text-align: center;font-weight: bold;font-size:18px;">
              User Profile Details
            </div>
            <br>
            <div id="spUserProfileProperties"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    this.getUserProperties(); 
  }

  protected get dataVersion(): Version {
    return Version.parse('1.02');
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

  private getUserProperties(): void { 
 
    pnp.sp.profiles.myProperties.get().then(
        (result) => {
          var userProperties = result.UserProfileProperties;
          var userPropertyValues = "";
          userProperties.forEach(
              (property) => {   
                userPropertyValues += property.Key + " - " + property.Value + "<br/>";
              }
          );
          document.getElementById("spUserProfileProperties").innerHTML = userPropertyValues;
        }
    ).catch(
        (error) => {
          console.log("Error: " + error); 
        }
    ); 
     
  }

}
