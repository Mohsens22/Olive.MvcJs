import { Url } from './Url'
import { Form } from './Form'

export class WindowContext {

    static setting = {
        TIME_FORMAT: "HH:mm",
        MINUTE_INTERVALS: 5,
        DATE_LOCALE: "en-gb"
    };
    static events: { [event: string]: Function[] } = {};

    public static isWindowModal(): boolean {
        if ($(this.getContainerIFrame()).closest(".modal").length === 0) return false;
        return true;
    }

    public static getContainerIFrame() {
        if (parent == null || parent == self) return null;
        return $(parent.document).find("iframe").filter((i, f: any) => (f.contentDocument || f.contentWindow.document) == document).get(0);
    }

    public static adjustModalHeightForDataPicker(target: any) {
        var datepicker = $(target.currentTarget).siblings('.bootstrap-datetimepicker-widget');

        if (datepicker.length === 0) {
            this.adjustModalHeight();
            return;
        }

        var offset = Math.ceil(datepicker.offset().top + datepicker[0].offsetHeight) - document.body.offsetHeight + 6;
        var overflow = Math.max(offset, 0);
        this.adjustModalHeight(overflow);
    }

    public static adjustModalHeight(overflow?: number) {
        if (this.isWindowModal()) {
            var frame = $(this.getContainerIFrame());
            if (frame.attr("data-has-explicit-height") != 'true')
                frame.height(document.body.offsetHeight + (overflow || 0));
        }
    }

    public static getPostData(trigger: JQuery): JQuerySerializeArrayElement[] {
        var form = trigger.closest("[data-module]");
        if (!form.is("form")) form = $("<form />").append(form.clone(true));
        var data = Form.merge(form.serializeArray());
        // If it's master-details, then we need the index.
        var subFormContainer = trigger.closest(".subform-item");
        if (subFormContainer != null) {
            data.push({
                name: "subFormIndex",
                value: subFormContainer.closest(".horizontal-subform, .vertical-subform").find(".subform-item").index(subFormContainer).toString()
            });
        }

        data.push({ name: "current.request.url", value: window.location.pathAndQuery() });
        return data;
    }

    public static handleAjaxResponseError(response) {
        this.hidePleaseWait();
        console.log(response);

        var text = response.responseText;
        if (text.indexOf("<html") > -1) {
            document.write(text);
        }
        else if (text.indexOf("<form") > -1) {
            var form = $("form", document);
            if (form.length) form.replaceWith($(text));
            else document.write(text);
        }
        else alert(text);
    }

    public static hidePleaseWait() {
        $(".wait-screen").remove();
    }

    public static toJson(data) {
        try {
            return JSON.parse(data);
        } catch (error) {
            console.log(error);
            console.log('Cannot parse this data to Json: ');
            console.log(data);
        }
    }

    public static applyColumns(event: JQueryEventObject) {
        var button = $(event.currentTarget);
        var checkboxes = button.closest(".select-cols").find(":checkbox");
        if (checkboxes.length === 0 || checkboxes.filter(":checked").length > 0) return;
        $("<input type='checkbox' checked='checked'/>").hide().attr("name", checkboxes.attr("name")).val("-")
            .appendTo(button.parent());
     }
}



