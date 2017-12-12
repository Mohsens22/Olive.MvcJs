export declare class OlivePage {
    DATE_FORMAT: string;
    TIME_FORMAT: string;
    DATE_TIME_FORMAT: string;
    MINUTE_INTERVALS: number;
    DISABLE_BUTTONS_DURING_AJAX: boolean;
    DATE_LOCALE: string;
    REDIRECT_SCROLLS_UP: boolean;
    AUTOCOMPLETE_INPUT_DELAY: number;
    DEFAULT_HTML_EDITOR_MODE: string;
    DEFAULT_MODAL_BACKDROP: string;
    constructor();
    _initializeActions: any[];
    onInit(action: any): void;
    _preInitializeActions: any[];
    onPreInit(action: any): void;
    events: {
        [event: string]: Function[];
    };
    on(event: string, handler: Function): void;
    raise(event: string, data?: any): boolean;
    pageLoad(container?: JQuery, trigger?: any): void;
    initializeUpdatedPage(container?: JQuery, trigger?: any): void;
    initialize(): void;
    changeItToChosen(selectControl: JQuery): void;
    skipNewWindows(): void;
    enableDragSort(container: any): void;
    enableSubMenus(menu: any): void;
    enablePasswordStengthMeter(container: any): void;
    ensureModalResize(): void;
    configureValidation(): void;
    updateSubFormStates(): void;
    enableDateDropdown(input: any): void;
    enableSelectAllToggle(event: any): void;
    enableInstantSearch(control: any): void;
    validateForm(trigger: any): boolean;
    enableConfirmQuestion(button: any): void;
    showConfirm(text: any, yesCallback: any): void;
    alertUnobtrusively(message: string, style?: string): void;
    enableAlert(): void;
    alert(text: string, style?: string, callback?: Function): void;
    enableNumericUpDown(input: any): void;
    enableFileUpload(input: any): void;
    openLinkModal(event: JQueryEventObject): boolean;
    toJson(data: any): any;
    runStartupActions(container?: JQuery, trigger?: any, stage?: string): void;
    canAutoFocus(input: JQuery): boolean;
    enableDateControl(input: JQuery): void;
    adjustModalHeightForDataPicker(e: any): void;
    awaitingAutocompleteResponses: number;
    handleDefaultButton(event: JQueryEventObject): boolean;
    deleteSubForm(event: JQueryEventObject): void;
    enableAjaxPaging(event: JQueryEventObject): void;
    enableAjaxSorting(event: JQueryEventObject): void;
    applyColumns(event: JQueryEventObject): void;
    enableAjaxRedirect(event: JQueryEventObject): boolean;
    ajaxChangedUrl: number;
    isAjaxRedirecting: boolean;
    ajaxRedirect(url: string, trigger?: JQuery, isBack?: boolean, keepScroll?: boolean, addToHistory?: boolean): boolean;
    ajaxRedirectBackClicked(event: any): void;
    returnToPreviousPage(target: any): boolean;
    cleanGetFormSubmit(event: JQueryEventObject): boolean;
    enableUserHelp(element: JQuery): void;
    executeActions(actions: any, trigger?: any): void;
    executeAction(action: any, trigger: any): boolean;
    executeNotifyAction(action: any, trigger: any): void;
    executeRedirectAction(action: any, trigger: any): void;
    replaceListControlSource(controlId: string, items: any): void;
    download(url: string): void;
    openWindow(url: string, target: string): void;
    showPleaseWait(blockScreen?: boolean): void;
    currentModal: any;
    getModalTemplate(options: any): string;
    isOpeningModal: boolean;
    openModal(url: string, options?: any): boolean;
    isClosingModal: boolean;
    closeModal(refreshParent?: boolean): boolean;
    refresh(keepScroll?: boolean): void;
    isAwaitingAjaxResponse: boolean;
    invokeActionWithAjax(event: any, actionUrl: any, syncCall?: boolean): boolean;
    enableSelectColumns(container: any): void;
    invokeActionWithPost(event: any): boolean;
    dynamicallyLoadedScriptFiles: any[];
    replaceMain(element: JQuery, trigger: any): void;
    invokeAjaxActionResult(response: any, containerModule: any, trigger: any): void;
    ensureNonModal(): void;
    isWindowModal(): boolean;
    getContainerIFrame(): HTMLElement;
    enableSlider(input: any): void;
    adjustModalHeight(overflow?: number): void;
    adjustIFrameHeightToContents(iframe: any): void;
    reloadValidationRules(form: JQuery): void;
    paginationSizeChanged(event: Event): void;
    highlightRow(element: any): void;
    cleanUpNumberField(field: JQuery): void;
    setSortHeaderClass(thead: JQuery): void;
}
