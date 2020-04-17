import { Component, OnInit, HostListener, ViewChild, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
import { PuzzleTypeModel } from '../../models/puzzle-types/PuzzleTypeModel';
import { ManufacturerModel } from '../../models/manufacturers/ManufacturerModel';
import { PuzzleLookupService } from '../../services/puzzle-lookup-service';
import { PuzzleColorModel } from '../../models/puzzle-colors/PuzzleColorModel';
import { PagedResponse } from '../../models/1pagination/paged-response';
import { PuzzleModel } from '../../models/puzzles/PuzzleModel';
import { PagedRequest } from '../../models/1pagination/paged-request';
import { RequestFilters } from '../../models/1pagination/request-filters';
import { LogicalOperator } from '../../models/1pagination/logical-operator';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Filter } from '../../models/1pagination/filter';
import { MatSort } from '@angular/material/sort';


@Component({
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component..css']
})
export class ProductsListComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges{

    rowsNumber: number;

    activatedRouteSubscr1: Subscription;
    activatedRouteSubscr2: Subscription;
    activatedRouteSubscr3: Subscription;
    subscriptions: Subscription[] = [];

    puzzleTypes: PuzzleTypeModel[];
    manufacturers: ManufacturerModel[];
    puzzleColors: PuzzleColorModel[];
    
    pagedPuzzles: PagedResponse<PuzzleModel>;
   
    // puzzles: PuzzleModel[] = PUZZLES;

    requestFilters: RequestFilters;

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    

    constructor(private lookupService: PuzzleLookupService,
                private activatedRoute: ActivatedRoute,
                private router: Router){
    }

    ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
        console.log('CHANGES: ' + changes);
    }

    onPageChanged(event){
        this.paginator.pageIndex = event.pageIndex;
        this.paginator.pageSize = event.pageSize;
        this.activatedRouteSubscr1 = this.activatedRoute.params.subscribe((val) => this.getPuzzles(val.puzzleType));

        this.subscriptions.push(this.activatedRouteSubscr1);
        
        window.scroll(0,0);
    }

    
    onChangeMatSelect(value: string){
        console.log(value);
        var orderby: string = value.split(',')[0];
        var orderbyDirection: string = value.split(',')[1];
        console.log(`${orderby} | ${orderbyDirection}`);
        
        this.activatedRouteSubscr2 = this.activatedRoute.params
            .subscribe((val) => this.getPuzzles(val.puzzleType, orderby, orderbyDirection));

        this.subscriptions.push(this.activatedRouteSubscr2);
    }


    ngAfterViewInit(): void {
        this.activatedRouteSubscr3 = this.activatedRoute.params
            .subscribe((val) => this.getPuzzles(val.puzzleType));
        
            this.subscriptions.push(this.activatedRouteSubscr3);
    }
   
    ngOnInit(): void {
        
        console.log();
        this.rowsNumber = (window.innerWidth <= 1100) ? 2 : 3;
        this.lookupService.getPuzzleTypes()
            .subscribe((pt: PuzzleTypeModel[]) => {
                this.puzzleTypes = pt;
            });
        
        this.lookupService.getManufacturers()
            .subscribe((m: ManufacturerModel[]) => this.manufacturers = m);

        this.lookupService.getPuzzleColors()
            .subscribe((c: PuzzleColorModel[]) => this.puzzleColors = c);
    }

    private getPuzzles(val: any, orderby: string = 'name', orderbyDirection: string = 'asc'){
        var url = this.activatedRoute.snapshot.url.join().split(',');

        var filters: Filter[] = [];
        var filter: Filter = {propertyName: 'puzzleType', propertyValue: val};
        filters.push(filter);

        this.requestFilters = {operator: LogicalOperator.OR, filters: filters};
        
        const pagedRequest = new PagedRequest(orderby, orderbyDirection,this.paginator.pageIndex, 
                                                this.paginator.pageSize, 
                                                this.requestFilters);
        
        console.log(pagedRequest);
        this.lookupService.getPuzzles(pagedRequest)
            .subscribe((pagedPuzzles: PagedResponse<PuzzleModel>) => {
                // this.puzzles = pagedPuzzles.items;
                this.pagedPuzzles = pagedPuzzles;
                // console.log(this.puzzles);
            }, err => {console.log(err)});
    }

    @HostListener('window:resize', ['$event'])
    onResize(event){
        this.rowsNumber = (event.target.innerWidth <= 1100) ? 2 : 3;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscr => subscr.unsubscribe());
    }
}


// const PUZZLES: PuzzleModel[]=[
//     {
//         id: 1,
//         name: "Gan 356 X",
//         description: "Gan делают круто, это уже аксиома. Первый кубик Рубика со сменными магнитами долго ждали, было интересно, как удастся сделать это. Ган сделали все максимально грамотно, и хоть Gan 356 X Numerical IPG 3x3x3 стоит немало, тому есть объяснение. Но перед тем, как обсуждать комплектацию и кручение, стоит разобраться в названии. Numerical IPG означает, что здесь используется новая, отличная от Gan 354 M, крестовина. К ней подходят другие гайки, которые можно закрутить даже пальцами. При этом система отдаленно напоминает систему регулировки как в GTS 3M. А вот теперь время поговорить о комплектации, она поражает. Главное – вы получаете упаковку сменных магнитов и гаек. Не забывайте, в кубе тоже установлены магниты и гайки, это четвертая вариация. Каждый человек может изменить кручение головоломки, подстроить под себя. Это пазл с гибкой настройкой, поэтому описать кручение очень сложно. Одно можно гарантировать: каждая из вариаций настройки головоломки будет восхитительной.",
//         price: 45.00,
//         "isWcaPuzzle": true,
//         weight: 350.0,
//         "manufacturer": "Gan",
//         "puzzleType": "3x3x3",
//         "color": "Stickerless",
//         "difficultyLevel": "Medium",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/ganx.jpg"
//             }
//         ]
//     },
//     {
//         "id": 2,
//         "name": "Gan 356 XS",
//         "description": "Gan 356 XS 3x3x3 появился на рынке осенью 2019 года. Ган взяли некоторые идеи из кубика MoYu 3x3x3 GuoGuan YueXiao EDM, доработали их и довели до совершенства.Одна из фишек – возможность менять силу магнитов. Вы можете двигать капсулу, из-за чего расположение магнитов изменяется относительно друг друга. Доступно 3 варианта фиксации граней: сильная, слабая и без фиксации вообще.А еще Ган отказались от сменных гаек, а перешли к системе двойной регулировки. Это позволяет менять силу пружин внутри гайки. Вам доступно 6 положений, что соответственно заменяет вам 6 гаек. Помимо этого, вы можете менять саму настройку куба. Мы уже видели такую настройку в их предыдущей модели Gan 356 X Numerical IPG 3x3x3. В сумме вы имеете 72 вариантов настройки. Так каждый имеет возможность подстроить кубик под себя. А так как в комплекте больше не идут дополнительные детали, цена получилась ниже, чем у Gan X. Если вы ищите себе новую премиальную модель, мы определенно рекомендуем вам Ган 356 Икс Эс. Это универсальная модель, которая подойдет практически каждому!",
//         "price": 60.00,
//         "isWcaPuzzle": true,
//         "weight": 330.0,
//         "manufacturer": "Gan",
//         "puzzleType": "3x3x3",
//         "color": "Stickerless",
//         "difficultyLevel": "Medium",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/ganxsstickerless.jpg"
//             }
//         ]
//     },
//     {
//         "id": 3,
//         "name": "MoYu Weilong GTS 3M",
//         "description": "Мою снова нас радуют топовым кубом! В этот раз им стал MoYu 3x3x3 WeiLong GTS 3M. Что же же в нем нового? Во-первых, это иновационная система настройки куба. Сейчас с помощью специальной отвертки вы сможете регулировать натяжение пружины, поэтому можно настроить куб абсолютно равномерно. Также у Мою 3х3х3 ВейЛонг ГТС 3М есть маленькие бортики, поэтому куб комфортнее держать во время сборки. Кроме этого, были доработаны крышки, теперь шанс того, что они выпадут, стремится к нулю. Магниты стали сильнее, но они идеально подходят именно этой модели. Комплектация заметно расширилась:помимо общей стильной упаковки, куб спрятан в прозрачный бокс, который превращается в подставку. Еще внутри вас ждет книжечка с коллекционными карточками и инструкцией, а также все что нужно для настройки головоломки.",
//         "price": 30.00,
//         "isWcaPuzzle": true,
//         "weight": 345.0,
//         "manufacturer": "MoYu",
//         "puzzleType": "3x3x3",
//         "color": "Stickerless",
//         "difficultyLevel": "Medium",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/moYuWeilonggts3m.jpg"
//             }
//         ]
//     },
//     {
//         "id": 4,
//         "name": "DaYan 7 TengYun",
//         "description": "В 2017 году легендарная компания Даян неожиданно вернулась на рынок скоростных кубов, выпустив модели Zhanchi 2017 и XiangYun. Хотя те кубики не произвели большого впечатления на спидкуберов, производитель решил не сдаваться и в начале 2019 года представил DaYan 3x3x3 TengYun M.На этот раз они сумели удивить – пазл получил немало положительных отзывов и даже стал любимым для некоторых куберов. К особенностям головоломки относятся доступная стоимость, мягкое приятное вращение и встроенные магниты, способствующие повышению стабильности при сборках. Даян 3х3х3 ТенгЮн М поставляется в комплекте с двумя наборами дополнительных пружин.",
//         "price": 25.00,
//         "isWcaPuzzle": true,
//         "weight": 334.0,
//         "manufacturer": "DaYan",
//         "puzzleType": "3x3x3",
//         "color": "Stickerless",
//         "difficultyLevel": "Medium",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/dayan7stickerless.jpg"
//             }
//         ]
//     },
//     {
//         "id": 5,
//         "name": "Gan 354 M",
//         "description": "Gan 354 M 3x3x3 стал первым уменьшенным кубиком профессионального уровня от компании Ган, широко известной благодаря своим флагманским моделям 3х3. Размер грани 54 мм позволяет комфортно использовать головоломку в сборке одной рукой, а также отлично подходит для спидкуберов, которых не устраивают стандартные габариты большинства современных кубов. В конструкции деталей используется технология магнитных капсул, впервые представленная в четверке Gan 460M, за счет чего все магниты, призванные повысить стабильность ваших сборок, располагаются строго на своих местах. Внутренняя поверхность элементов получила фирменный рельеф в виде пчелиных сот, позволяющий минимизировать трение и обеспечить кубику максимально легкое и приятное вращение. Стоит отметить и необычную внешность куба - все детали, кроме цветных крышек, изнутри выполнены из черного пластика. Перечисленные преимущества позволяют смело порекомендовать этот кубик всем желающим приобрести топовую модель!",
//         "price": 34.00,
//         "isWcaPuzzle": true,
//         "weight": 290.0,
//         "manufacturer": "Gan",
//         "puzzleType": "3x3x3",
//         "color": "Stickerless",
//         "difficultyLevel": "Medium",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/gan354m.jpg"
//             }
//         ]
//     },
//     {
//         "id": 6,
//         "name": "QiYi Valk Power M",
//         "description": "На первой версией было сделано множество шикарных сборок, в том числе два мировых рекорда, и вот Чии Мофанг представили новую усовершенствованную версию. Она лучше первой абсолютно по всем параметрам, от резки углов до долговечности куба. Чии Мофанг 3х3х3 Валк 3 Повер получил некоторые конструкционные изменения: теперь он имеет премиум пластик и потерял отверстия в уголках, это было сделано для улучшения контроля куба. Несомненным недостатком первой версии была коробочка, её было очень сложно открыть. Теперь она стала магнитной и открывается намного легче. В комплекте с кубом вы найдете дополнительные наклейки и логотипы. Для максимальной кастомизации куба вы можете наклеить более яркий красный и синий цвет. Кроме всего этого, в качестве аксессуара в комлекте идет еще и тряпочка для чистки куба. QiYi MoFangGe 3x3x3.",
//         "price": 17.00,
//         "isWcaPuzzle": true,
//         "weight": 330.0,
//         "manufacturer": "QiYi",
//         "puzzleType": "3x3x3",
//         "color": "Stickerless",
//         "difficultyLevel": "Medium",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/valkpowerm.jpg"
//             }
//         ]
//     },
//     {
//         "id": 7,
//         "name": "QiYi WuQue Mini M",
//         "description": "QiYi MoFangGe 4x4x4 WuQue Mini M стала магнитной модификацией компактной версии знаменитой четверки ВиКуе, с помощью которой было установлено множество впечатляющих национальных, континентальных и мировых рекордов, включая сборку за 18.42 секунд от Макса Парка. Внутри каждого элемента располагаются специальные слоты для магнитов, благодаря которым все они приклеены точно на свои места.Такая конструкция головоломки способствует высокой стабильности и контролю при сборках. В остальном строение кубика очень похоже на старшую модель, что обеспечивает ему приятное вращение и превосходные скоростные характеристики. Такие преимущества делают Чии Мофанг 4х4х4 ВиКуе Мини М универсальным выбором для спидкуберов любого уровня.",
//         "price": 24.00,
//         "isWcaPuzzle": true,
//         "weight": 330.0,
//         "manufacturer": "QiYi",
//         "puzzleType": "4x4x4",
//         "color": "Stickerless",
//         "difficultyLevel": "Medium",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/qiyiwuquemini.jpg"
//             }
//         ]
//     },
//     {
//         "id": 8,
//         "name": "QiYi X-Man Skewb Wingy M",
//         "description": "Данный скьюб полностью оправдывает свое место в линейке топовых головоломок X-Man. QiYi MoFangGe X-Man Skewb Wingy Magnetic выделяется среди всех своим строением: вместо подшипников в нем установлены магниты, что встречается все чаще в современных головоломках, также куб имеет вогнутые грани, за счет чего в руках скьюб лежит очень удобно и приятно. Все это делает из Чии МоФанг Икс-Мэн Скьюб Винги Магнетик отличный высокоскоростной скьюб. В комплекте с ним идет пластиковый бокс, который защитит вашу головоломку от падений и грязи и подойдет к любой головоломке размером до 57мм. Этот скьюб подойдет куберам любого уровня и будет достойно смотреться в любой коллекции, при этом он имеет не очень большую стоимость для топовой головоломки.",
//         "price": 12.00,
//         "isWcaPuzzle": true,
//         "weight": 220.0,
//         "manufacturer": "QiYi",
//         "puzzleType": "skewb",
//         "color": "Stickerless",
//         "difficultyLevel": "Low",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/qiyixmanskewb.jpg"
//             }
//         ]
//     },
//     {
//         "id": 9,
//         "name": "MoYu Skewb AoYan M",
//         "description": "На рынке скьюбов долгое время был один лидер – X-Man Skewb Wingy. Наконец MoYu удалось создать конкурентоспособную головоломку, которая станет популярной среди профессиональных спидкуберов. MoYu Skewb AoYan M – обновление старого Мою Скьюб Магнетик. В старом кубе присутствовали некоторые недостатки, которые попытались исправить в новом пазле. Например, магниты стали сильнее. Они все еще не замедляют головоломку, но помогают стабилизировать ее. Версия из цветного пластика имеет важное преимущество: в комплектацию входят сменные центры с ямками посередине. Во время сборки пальцы попадают в ямки и кубик гораздо легче удерживать. К сожалению, куб из черного пластика обделен такой особенностью. Богатая комплектация топовых кубов MoYu стала привычной. Помимо самого Мою Скьюб АоЯн М, в коробке лежит подставка и отвертка для настройки. Подобную комплектацию мы видели в GTS 3M. У Мою получился отличный скьюб. Профессионалы, которые ценят качество и стремятся получить лучший пазл, должны задуматься об обновлении своей головоломки.",
//         "price": 22.00,
//         "isWcaPuzzle": true,
//         "weight": 220.0,
//         "manufacturer": "MoYu",
//         "puzzleType": "3x3x3",
//         "color": "Stickerless",
//         "difficultyLevel": "Medium",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/moyuskewbaoanm.jpg"
//             }
//         ]
//     },
//     {
//         "id": 10,
//         "name": "MoYu Square-1 MeiLong",
//         "description": "Скваеры ‒ это не самая популярная дисциплина, поэтому моделей на рынке не так много. Но периодически разные компании выпускают свои модели. В начале 2020 появилась головоломка от MoYu. Проблема в том, что MoYu пришлось конкурировать с шикарнейшим YuXin Little Magic. Цена на эти головоломки практически одинакова, поэтому сравнений не избежать. По сравнению с продукцией YuXin, кубик MoYu гораздо медленнее. Это сделано для большего контроля. Это понравится новичкам, которые еще не стремятся собирать на скорость. С MoYu Square-1 MeiLong вы не будете ошибаться, из-за чего на нем легко учиться. МоЮ Скваер-1 МейЛонг понравится новичкам. Если у вас не было другой модели, этот куб подойдет для обучения. Для скоростной сборки позднее придется взять модель покруче, вроде YuXin Little Magic M или X-man Volt V2.",
//         "price": 10.00,
//         "isWcaPuzzle": true,
//         "weight": 220.0,
//         "manufacturer": "MoYu",
//         "puzzleType": "square-1",
//         "color": "Stickerless",
//         "difficultyLevel": "Medium",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/moyusq1meilong.jpg"
//             }
//         ]
//     },
//     {
//         "id": 12,
//         "name": "MoYu Weilong Gts M",
//         "description": "Легендарный кубик от компании Мою. Этот куб хвалили и до сих пор хвалят многие из профессионалов. Мою 3х3х3 ВейЛонг ГТС поставляется сразу в 9 цветах, что не может не радовать, ведь желание обладать кубиком необычного цвета и выделяться появляется у многих. Куб обладает превосходными характеристиками: скорость, контроль, плавность, мягкость, резка углов. Но этот кубик можно сделать еще лучше, поставив на него магниты. Также существует вторая версия этого кубика, но она не может похвастаться столь широким выбором цвета.MoYu 3x3x3 WeiLong GTS является действительно хорошим кубом в средне-дорогом сегменте, который может похвастаться блестящим качеством и кручением, но уже не может называться лучшим решением, ведь на рынке есть его старший брат.",
//         "price": 15.00,
//         "isWcaPuzzle": true,
//         "weight": 0.0,
//         "manufacturer": "MoYu",
//         "puzzleType": "3x3x3",
//         "color": "Black",
//         "difficultyLevel": "Medium",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/moyugtsm.jpg"
//             }
//         ]
//     },
//     {
//         "id": 13,
//         "name": "MoYu Ausu Gts M",
//         "description": "Мою - это отличная компания, которая давно радует всех отличными скоростными головоломками. Одним из таких является шикарный кубик 4х4х4 АоСу. И теперь вы можете насладится MoYu 4x4x4 AoSu GTS M, этот куб хорош. И несмотря на то, что это первый магнитный кубик 4x4x4, магниты в нем отлично подобраны и прекрасно дополняют его кручение. Также он получил некоторые конструктивные доработки, его вращение стало еще приятнее, чем у своего великого предка.",
//         "price": 26.00,
//         "isWcaPuzzle": true,
//         "weight": 0.0,
//         "manufacturer": "MoYu",
//         "puzzleType": "4x4x4",
//         "color": "Black",
//         "difficultyLevel": "High",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/moyuaosugtsm.jpg"
//             }
//         ]
//     },
//     {
//         "id": 14,
//         "name": "MoFangGe 4x4x4 WuQue",
//         "description": "QiYi MoFangGe 4x4x4 WuQue стала первой четверкой из нашумевшей серии топовых кубов от QiYi MoFangGe. Сразу после выхода на нее перешло большинство профессиональных спидкуберов по всему миру, в результате чего было установлено множество новых мировых и континентальных рекордов как по единичной попытке, так и по среднему времени. Головоломка обладает хорошо продуманным строением, которое обеспечивает легкое и приятное вращение, а также снижает количество локапов при сборках. Еще одной отличительной особенностью данного куба можно назвать относительно небольшой вес.",
//         "price": 20.00,
//         "isWcaPuzzle": true,
//         "weight": 0.0,
//         "manufacturer": "QiYi",
//         "puzzleType": "4x4x4",
//         "color": "Stickerless",
//         "difficultyLevel": "High",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/qiyiwuque.jpg"
//             }
//         ]
//     },
//     {
//         "id": 15,
//         "name": "QiYi MoFangGe 5x5x5 WuShuang",
//         "description": "Топовая пятерка от зарекомендовавшего себя производителя QiYi MoFangGe. Кубик получил восторженные отзывы от спидкуберов. Отличная скорость, резка углов, мягкость, плавность, контроль - вот несомненные достоинства Чии Мофанг 5х5х5 ВуШуанг. Доступен в нескольких цветовых вариациях: черный, белый, цветной и слоновой кости. Последний вариант встречается достаточно редко, а ценители моментально расхватывают его.",
//         "price": 23.00,
//         "isWcaPuzzle": true,
//         "weight": 0.0,
//         "manufacturer": "QiYi",
//         "puzzleType": "5x5x5",
//         "color": "Stickerless",
//         "difficultyLevel": "High",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/qiyiwushuang.jpg"
//             }
//         ]
//     },
//     {
//         "id": 16,
//         "name": "MoYu 5x5x5 MeiLong",
//         "description": "В 2019 году на рынке очень много бюджетных головоломок. Но это не значит, что нужно перестать их выпускать! Так и подумала MoYu и запустила целую линейку MeiLong.Из коробки этот куб сухой и не самый быстрый. Если у вас нет опыта работы с кубиком, это даже может стать проблемо. Вам придется залить несколько капель специальной жидкой смазки, а также покрутить кубик какое-то время. Так он притрется, раскроется и станет гораздо круче.Это очень неплохая и достойная бюджетка. Она крутится не хуже конкурентов и обладает всеми характеристиками, чтобы быстро собирать ее. Если вы только начинаете свой путь в спидкубинге, эта модель вам прекрасно подойдет.",
//         "price": 10.00,
//         "isWcaPuzzle": true,
//         "weight": 0.0,
//         "manufacturer": "MoYu",
//         "puzzleType": "5x5x5",
//         "color": "Stickerless",
//         "difficultyLevel": "High",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/moyumeilongstickerless.jpg"
//             }
//         ]
//     },
//     {
//         "id": 17,
//         "name": "QiYi MoFangGe 3x3x3 Sail",
//         "description": "QiYi MoFangGe 3x3x3 Sail является одним из самых доступных и популярных кубиков на рынке. Головоломка обладает неплохим кручением, которое достигается за счет простого, но качественного строения. На каждой детали имеются специальные рельсы, уменьшающие трение при сборках, а большие отверстия между элементами обеспечивают кубу приемлемую резку углов. Благодаря своей низкой цене и достойным характеристикам, Чии Мофанг 3х3х3 Сэил может отлично подойти всем новичкам в качестве первого скоростного кубика/",
//         "price": 3.00,
//         "isWcaPuzzle": true,
//         "weight": 0.0,
//         "manufacturer": "QiYi",
//         "puzzleType": "5x5x5",
//         "color": "Stickerless",
//         "difficultyLevel": "High",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/qiyisail.jpg"
//             }
//         ]
//     },
//     {
//         "id": 18,
//         "name": "YJ 3x3x3 MGC",
//         "description": "YJ 3х3х3 MGC является первой флагманской трешкой от компании УайДжэй, ранее выпускавшей только бюджетные кубики и разные не-WCA головоломки. Благодаря продуманной конструкции и магнитам, куб может похвастаться впечатляющими скоростными характеристиками, среди которых стоит отметить очень тихое вращение, мягкость, плавность и высокую скорость. При правильной настройке данная головоломка даже может посоревноваться с более дорогими моделями.",
//         "price": 7.00,
//         "isWcaPuzzle": true,
//         "weight": 181.0,
//         "manufacturer": "YJ",
//         "puzzleType": "3x3x3",
//         "color": "Stickerless",
//         "difficultyLevel": "Medium",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/yjmgc.jpg"
//             }
//         ]
//     },
//     {
//         "id": 19,
//         "name": "YJ 3x3x3 MGC v2",
//         "description": "С выхода первой MGC прошло полгода, и вдруг ВайДжей выпускают вторую версию. Первый куб был очень крутым, и мы все очень ждали выхода YJ 3x3x3 MGC v2. Кубик получился хорошим, с интересными фишками, но подойдет не для все.ВайДжей пошли по пути Ган и стали добавлять гайки разной жесткости в комплект. Всего их 2 вида, третий установлен в самом кубе. Возможность настройки под себя радует, стоит попробовать все 3 вида пружин.А еще здесь изменили дизайн уголков, они стала угловатыми. Случайно провернуть их теперь практически невозможно/",
//         "price": 11.00,
//         "isWcaPuzzle": true,
//         "weight": 185.0,
//         "manufacturer": "YJ",
//         "puzzleType": "3x3x3",
//         "color": "Stickerless",
//         "difficultyLevel": "Medium",
//         "materialType": "Plastic",
//         "images": [
//             {
//                 "fileName": "../../assets/yjmgcstickerless.jpg"
//             }
//         ]
//     }
// ]