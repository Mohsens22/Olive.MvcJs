
import Config from "olive/Config"

import Form from 'olive/Components/Form'
import Url from 'olive/Components/Url'
import SystemExtensins from 'olive/Extensions/SystemExtensins';
import Modal from 'olive/Components/Modal'
import Validate from 'olive/Components/Validate'
import Sorting from 'olive/Components/Sorting'
import Paging from 'olive/Components/Paging'
import MasterDetail from 'olive/Components/MasterDetail'
import Alert from 'olive/Components/Alert'
import Action from 'olive/Components/Action'
import Waiting from 'olive/Components/Waiting'
import Grid from 'olive/Components/Grid'

import Select from 'olive/Plugins/Select'
import PasswordStength from 'olive/Plugins/PasswordStength'
import HtmlEditor from 'olive/Plugins/HtmlEditor'
import TimeControl from 'olive/Plugins/TimeControl'
import AutoComplete from 'olive/Plugins/AutoComplete'
import Slider from 'olive/Plugins/Slider'
import DatePicker from 'olive/Plugins/DatePicker'
import NumbericUpDown from 'olive/Plugins/NumericUpDown'
import FileUpload from 'olive/Plugins/FileUpload'
import ConfirmBox from 'olive/Plugins/ConfirmBox'
import SubMenu from 'olive/Plugins/SubMenu'
import InstantSearch from 'olive/Plugins/InstantSearch'
import DateDropdown from 'olive/Plugins/DateDropdown'

export default class OlivePage {

    modal: any = null;

    constructor() {
        SystemExtensins.initialize();
        Modal.initialize();

        $(() => {
            //$.fn.modal.Constructor.DEFAULTS = $.extend($.fn.modal.Constructor.DEFAULTS, { backdrop: this.DEFAULT_MODAL_BACKDROP });
            //$.fn.modal.Constructor.DEFAULTS.backdrop = this.DEFAULT_MODAL_BACKDROP;
            Alert.enableAlert();
            Validate.configure();
            this.pageLoad();
        });

        // TODO: Find a cleaner way.
        window["alertify"] = <alertify.IAlertifyStatic>window.require("alertify")();
    }

    _initializeActions = [];
    onInit(action) { this._initializeActions.push(action) }

    _preInitializeActions = [];
    onPreInit(action) { this._preInitializeActions.push(action) }

    pageLoad(container: JQuery = null, trigger: any = null) {
        $('[autofocus]:not([data-autofocus=disabled]):first').focus();
        this.initializeUpdatedPage(container, trigger);
        if (Config.REDIRECT_SCROLLS_UP) $(window).scrollTop(0);
    }

    initializeUpdatedPage(container: JQuery = null, trigger: any = null) {
        this.runStartupActions(container, trigger, "PreInit");
        this.initialize();
        this.runStartupActions(container, trigger, "Init");
    }

    initialize() {

        this._preInitializeActions.forEach((action) => action());

        // =================== Standard Features ====================

        $(".select-cols .apply").off("click.apply-columns").on("click.apply-columns", (e) => Grid.applyColumns(e));
        $("[data-delete-subform]").off("click.delete-subform").on("click.delete-subform", (e) => MasterDetail.deleteSubForm(e));
        $("[target='$modal'][href]").off("click.open-modal").on("click.open-modal", (e) => this.openLinkModal(e));
        $(".select-grid-cols .group-control").each((i, e) => Grid.enableSelectColumns($(e)));
        $("th.select-all > input:checkbox").off("click.select-all").on("click.select-all", (e) => Grid.enableSelectAllToggle(e));
        $("[data-user-help]").each((i, e) => this.enableUserHelp($(e)));
        $("form input, form select").off("keypress.default-button").on("keypress.default-button", (e) => Form.onDefaultButtonKeyPress(e));
        $("form[method=get] .pagination-size").find("select[name=p],select[name$='.p']").off("change.pagination-size").on("change.pagination-size", (e) => Paging.onSizeChanged(e));
        $("[data-sort-item]").parents("tbody").each((i, e) => Sorting.enableDragSort($(e)));
        $("a[data-pagination]").off("click.ajax-paging").on("click.ajax-paging", (e) => Paging.enableWithAjax(e));
        $("a[data-sort]").off("click.ajax-sorting").on("click.ajax-sorting", (e) => Sorting.enableAjaxSorting(e));
        $("th[data-sort]").each((i, e) => Sorting.setSortHeaderClass($(e)));
        $("[data-val-number]").off("blur.cleanup-number").on("blur.cleanup-number", (e) => Form.cleanUpNumberField($(e.currentTarget)));
        $("[data-toggle=tab]").off("click.tab-toggle").on("click.tab-toggle", () => Modal.ensureHeight());
        $("select.form-control").each((i, e) => Select.enhance($(e)));
        $("iframe[data-adjust-height=true]").off("load.auto-adjust").on("load.auto-adjust",
            (e: any) => $(e.currentTarget).height(e.currentTarget.contentWindow.document.body.scrollHeight));

        //$.validator.unobtrusive.parse('form');

        // =================== Plug-ins ====================
        $("[name=InstantSearch]").each((i, e) => new InstantSearch($(e)).enable());
        $("input[autocomplete-source]").each((i, e) => new AutoComplete($(e)).handle());
        $("[data-control=date-picker],[data-control=calendar]").each((i, e) => new DatePicker($(e)));
        $("[data-control='date-picker|time-picker']").each((i, e) => new TimeControl($(e)));
        $("[data-control=time-picker]").each((i, e) => new TimeControl($(e)));
        $("[data-control=date-drop-downs]").each((i, e) => DateDropdown.enable($(e)));
        $("[data-control=html-editor]").each((i, e) => new HtmlEditor($(e)).enable());
        $("[data-control=numeric-up-down]").each((i, e) => new NumbericUpDown($(e)).enable());
        $("[data-control=range-slider],[data-control=slider]").each((i, e) => new Slider($(e)).enable());
        $(".file-upload input:file").each((i, e) => new FileUpload($(e)).enable());
        $("[data-confirm-question]").each((i, e) => new ConfirmBox($(e)).enable());
        $(".password-strength").each((i, e) => PasswordStength.enable($(e)));
        $(".with-submenu").each((i, e) => new SubMenu($(e)));

        // =================== Request lifecycle ====================
        $(window).off("popstate.ajax-redirect").on("popstate.ajax-redirect", (e) => Action.ajaxRedirectBackClicked(e, this.invokeAjaxActionResult));
        $("a[data-redirect=ajax]").off("click.ajax-redirect").on("click.ajax-redirect", (e) => Action.enableAjaxRedirect(e, this.invokeAjaxActionResult));
        $('form[method=get]').off("submit.clean-up").on("submit.clean-up", (e) => this.cleanGetFormSubmit(e));
        $("[formaction]").not("[formmethod=post]").off("click.formaction").on("click.formaction", (e) => Action.invokeActionWithAjax(e, $(e.currentTarget).attr("formaction"), false, this.invokeAjaxActionResult));
        $("[formaction][formmethod=post]").off("click.formaction").on("click.formaction", (e) => Action.invokeActionWithPost(e));
        $("[data-change-action]").off("change.data-action").on("change.data-action", (e) => Action.invokeActionWithAjax(e, $(e.currentTarget).attr("data-change-action"), false, this.invokeAjaxActionResult));
        $("[data-change-action][data-control=date-picker],[data-change-action][data-control=calendar]").off("dp.change.data-action").on("dp.change.data-action", (e) => Action.invokeActionWithAjax(e, $(e.currentTarget).attr("data-change-action"), false, this.invokeAjaxActionResult));

        MasterDetail.updateSubFormStates();
        Modal.adjustHeight();

        this._initializeActions.forEach((action) => action());
    }

    skipNewWindows() {
        // Remove the target attribute from links:
        $(window).off('click.SanityAdapter').on('click.SanityAdapter', e => {
            $(e.target).filter('a').removeAttr('target');
        });

        window["open"] = (url, r, f, re) => { location.replace(url); return window; };
    }

    openLinkModal(event: JQueryEventObject) {
        this.openModal(event);
        return false;
    }

    runStartupActions(container: JQuery = null, trigger: any = null, stage: string = "Init") {
        if (container == null) container = $(document);
        if (trigger == null) trigger = $(document);
        var actions = [];
        $("input[name='Startup.Actions']", container).each((index, item) => {
            var action = $(item).val();
            if (actions.indexOf(action) === -1)
                actions.push(action);
        });

        for (var action of actions) {
            if (action && (action.Stage || "Init") == stage) this.executeActions(JSON.safeParse(action), trigger);
        }
    }

    goBack(target) {
        var returnUrl = Url.getQuery("ReturnUrl");

        if (returnUrl && target && $(target).is("[data-redirect=ajax]"))
            Action.ajaxRedirect(returnUrl, $(target), false, false, true, this.invokeAjaxActionResult);
        else Url.goBack();

        return false;
    }

    cleanGetFormSubmit(event: JQueryEventObject) {

        var form = $(event.currentTarget);
        if (Validate.validateForm(form) == false) { Waiting.hidePleaseWait(); return false; }

        var formData = Form.merge(form.serializeArray()).filter(item => item.name != "__RequestVerificationToken");

        var url = Url.removeEmptyQueries(form.attr('action'));

        try {

            form.find("input:checkbox:unchecked").each((ind, e) => url = Url.removeQuery(url, $(e).attr("name")));

            for (var item of formData)
                url = Url.updateQuery(url, item.name, item.value);

            url = Url.removeEmptyQueries(url);

            if (form.is("[data-redirect=ajax]")) Action.ajaxRedirect(url, form, false, false, true, this.invokeAjaxActionResult);
            else location.href = url;
        }
        catch (error) {
            console.log(error);
            alert(error);
        }
        return false;
    }

    executeActions(actions: any, trigger: any = null) {
        for (var action of actions) {
            if (!this.executeAction(action, trigger)) return;
        }
    }

    executeAction(action: any, trigger: any): boolean {
        if (action.Notify || action.Notify == "") this.executeNotifyAction(action, trigger);
        else if (action.Script) eval(action.Script);
        else if (action.BrowserAction == "Back") window.history.back();
        else if (action.BrowserAction == "CloseModal" && this.modal && this.closeCurrentModal() === false) return false;
        else if (action.BrowserAction == "CloseModalRefreshParent" && this.modal && this.closeCurrentModal(true) === false) return false;
        else if (action.BrowserAction == "Close") window.close();
        else if (action.BrowserAction == "Refresh") this.refresh();
        else if (action.BrowserAction == "Print") window.print();
        else if (action.BrowserAction == "ShowPleaseWait") Waiting.showPleaseWait(action.BlockScreen);
        else if (action.ReplaceSource) Select.replaceSource(action.ReplaceSource, action.Items);
        else if (action.Download) window.download(action.Download);
        else if (action.Redirect) this.executeRedirectAction(action, trigger);
        else alert("Don't know how to handle: " + JSON.stringify(action).htmlEncode());

        return true;
    }

    closeCurrentModal(refreshParrent: boolean = false) {
        if (refreshParrent) {
            this.refresh();
        }
        return this.modal.closeModal();
    }

    openModal(event, url?, options?) {

        if (this.modal) {
            this.modal.close();
            this.modal = false;
        }
        this.modal = new Modal(event, url, options);
        this.modal.open();
    }

    executeNotifyAction(action: any, trigger: any) {
        if (action.Obstruct == false)
            Alert.alertUnobtrusively(action.Notify, action.Style);
        else Alert.alert(action.Notify, action.Style);
    }

    executeRedirectAction(action: any, trigger: any) {
        if (action.Redirect.indexOf('/') != 0 && action.Redirect.indexOf('http') != 0) action.Redirect = '/' + action.Redirect;

        if (action.OutOfModal && window.isModal()) parent.window.location.href = action.Redirect;
        else if (action.Target == '$modal') this.openModal(null, action.Redirect, {});
        else if (action.Target && action.Target != '') window.open(action.Redirect, action.Target);
        else if (action.WithAjax === false) location.replace(action.Redirect);
        else if ((trigger && trigger.is("[data-redirect=ajax]")) || action.WithAjax == true) Action.ajaxRedirect(action.Redirect, trigger, false, false, true, this.invokeAjaxActionResult);
        else location.replace(action.Redirect);
    }

    refresh(keepScroll: boolean = false) {
        if ($("main").parent().is("body"))
            Action.ajaxRedirect(location.href, null, false /*isBack*/, keepScroll, false, this.invokeAjaxActionResult/*addToHistory:*/);
        else location.reload();
    }

    dynamicallyLoadedScriptFiles = [];

    replaceMain(element: JQuery, trigger) {
        var referencedScripts = element.find("script[src]").map((i, s) => $(s).attr("src"));
        element.find("script[src]").remove();

        $("main").replaceWith(element);

        if (referencedScripts.length) {
            var expectedScripts = referencedScripts.length;
            var loadedScripts = 0;
            referencedScripts.each((index, item) => {
                var url = '' + item;
                if (this.dynamicallyLoadedScriptFiles.indexOf(url) > -1) {
                    loadedScripts++;
                    if (loadedScripts == expectedScripts) this.pageLoad(element, trigger);
                }
                else {
                    this.dynamicallyLoadedScriptFiles.push(url);
                    $.getScript(url, () => {
                        loadedScripts++;
                        if (loadedScripts == expectedScripts) this.pageLoad(element, trigger);
                    });
                }
            });
        }
        else this.pageLoad(element, trigger);

        document.title = $("#page_meta_title").val();
    }

    invokeAjaxActionResult(response, containerModule, trigger) {

        var asElement = $(response);

        if (asElement.is("main")) {
            this.replaceMain(asElement, trigger);
            return;
        }

        if (asElement.is("[data-module]")) {
            // TODO: Support specifying the module to be updated at the Action level.
            containerModule.replaceWith(asElement);

            this.initializeUpdatedPage(asElement, trigger);
        }
        else if (response.length == 1 && response[0].ReplaceView) {
            asElement = $("<div/>").append(response[0].ReplaceView);
            containerModule.replaceWith(asElement);
            this.initializeUpdatedPage(asElement, trigger);
        }
        else if (trigger && trigger.is("[data-add-subform]")) {
            var subFormName = trigger.attr("data-add-subform");
            var container = containerModule.find("[data-subform=" + subFormName + "] > table tbody:first");

            if (container.length == 0) container = containerModule.find("[data-subform=" + subFormName + "]:first");

            container.append(asElement);

            Validate.reloadRules(trigger.parents("form"));

            MasterDetail.updateSubFormStates();

            this.initializeUpdatedPage(asElement, trigger);
        }
        else {
            this.executeActions(response, trigger);
            this.initialize();
        }
    }

    public enableUserHelp(element: JQuery) {
        element.click(() => false);
        var message = element.attr('data-user-help');  // todo: unescape message and conver to html
        element['popover']({ trigger: 'focus', content: message });
    }
}