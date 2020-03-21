## Основные элементы проекта

* В данном проекте разобрана механика создания пакетов развертывания
элементов структуры портала - полей, типов контента, списков

* Отработана механика разверывания релизов в последовательной версионности.


## Полезные наблюдения

### Списки

Интересно, что **FeaturesId** являются уникальными для каждого вида списка.
Например для списков типа *Task* возможны такие варианты:

```
    <WebFeatures>
        <!--HierarchyTasksList Feature-->
        <Feature ID="{f9ce21f8-f437-4f7e-8bc6-946378c850f0}" Name="FeatureDefinition/15/f9ce21f8-f437-4f7e-8bc6-946378c850f0" SourceVersion="1.0.20.0" />
        <!--TasksList Feature-->
        <Feature ID="{00bfea71-a83e-497e-9ba0-7a5c597d0107}" Name="FeatureDefinition/15/00bfea71-a83e-497e-9ba0-7a5c597d0107" SourceVersion="1.0.0.0" />
        <!--GanttTasksList Feature-->
        <Feature ID="{00bfea71-513d-4ca0-96c2-6a47775c0119}" Name="FeatureDefinition/15/00bfea71-513d-4ca0-96c2-6a47775c0119" SourceVersion="0.0.0.0" />
    </WebFeatures>
  ```

### Контент-типы
  Для того что бы в новой версии контент типа удалить поле, можно воспользоваться таким приемом

  в elements.xml задать *<RemoveFieldRef... />*

  ```
    <ContentType ID="0x010042D0C1C200A14B6887742B6344675C8B" 
            Name="Cost Center" 
            Group="SPFx Content Types" 
            Inherits="FALSE"
            Description="Sample content types from web part solution">
        <FieldRefs>

            <RemoveFieldRef ID="{fa564e0f-0c70-4ab9-b863-0177e6ddd247}" />

            <FieldRef ID="{060E50AC-E9C1-4D3C-B1F9-DE0BCAC300F6}" /> 
            <FieldRef ID="{943E7530-5E2B-4C02-8259-CCD93A9ECB18}" />
        </FieldRefs>
    </ContentType> 
  ```

  а в schema.xml перечислить обновленный список полей
  ```
    <ContentType 
        Name="Cost Center" 
        ID="0x010042D0C1C200A14B6887742B6344675C8B" 
        Group="SPFx 
        Content Types" 
        Inherits="FALSE">
        <FieldRefs>          
          <FieldRef ID="{060E50AC-E9C1-4D3C-B1F9-DE0BCAC300F6}" /> 
          <FieldRef ID="{943E7530-5E2B-4C02-8259-CCD93A9ECB18}" />          
        </FieldRefs>
    </ContentType>
  ```

  ### Поля

  Для генерации GUID кастомных полей можно воспользоваться сторонним ресурсом
  [GUID-генератор](https://www.guidgenerator.com/)





