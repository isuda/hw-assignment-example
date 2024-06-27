import { mount } from "@vue/test-utils";
import FileDownloader, { STATUS, SAMPLE_DATA } from "./FileDownloader.vue";

//only available files can be selected
const numAvailableFiles = SAMPLE_DATA.filter(
  (f) => f.status === STATUS.available,
).length;

describe("FileDownloader", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(FileDownloader);
  });

  describe("download files button", () => {
    let button;

    beforeEach(() => {
      button = wrapper.find("#download-button");
    });

    test("download files button is disabled when no items are selected", () => {
      expect(button.attributes().disabled).toBe("");
    });

    test.only(`* Clicking "Download Selected" when some or all items are displayed should generate an alert box with the path and device of all selected files.`, async () => {
      window.alert = function () {};
      const alertSpy = vi.spyOn(window, "alert");
      const checkToggle = wrapper.find(`#check-toggle`);
      await checkToggle.trigger("click");
      expect(button.attributes().disabled).toBeUndefined();
      await button.trigger("submit");
      expect(alertSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("checkToggle", () => {
    const checkToggleId = "check-toggle";
    let checkToggle, checkToggleLabel;

    beforeEach(() => {
      checkToggle = wrapper.find(`#${checkToggleId}`);
      checkToggleLabel = wrapper.find(`label[for=${checkToggleId}`);
    });

    test("* The select-all checkbox should be in an unselected state if no items are selected.", () => {
      expect(checkToggle.element.checked).toBeFalsy();
    });

    test("* The select-all checkbox should be in a selected state if all items are selected.", async () => {
      //
      // In my implementation I interpreted this requirement as all selectable items are selected
      // where the selectable items are the ones with an available status
      //
      const checkboxes = wrapper.findAll(
        "#file-list tbody input[type='checkbox']:not([disabled])",
      );

      for (let b of checkboxes) {
        await b.trigger("click");
      }
      expect(checkToggle.element.checked).toBeTruthy();
    });

    test("* The select-all checkbox should be in an indeterminate state if some but not all items are selected.", async () => {
      const checkbox = wrapper.find(
        "#file-list tbody input[type='checkbox']:not([disabled])",
      );
      await checkbox.trigger("click");
      expect(checkToggle.element.indeterminate).toBeTruthy();
      expect(checkToggleLabel.text()).toBe(`Selected 1`);
    });

    test(`* The "Selected 2" text should reflect the count of selected items and display "None Selected" when there are none selected.`, async () => {
      expect(checkToggleLabel.text()).toBe("None Selected");
      await checkToggle.trigger("click");
      expect(checkToggleLabel.text()).toBe(`Selected ${numAvailableFiles}`);
    });

    test("* Clicking the select-all checkbox should de-select all items if all are currently selected.", async () => {
      await checkToggle.trigger("click");
      await checkToggle.trigger("click");
      expect(checkToggleLabel.text()).toBe("None Selected");
    });

    test("* Clicking the select-all checkbox should select all items if none or some are selected.", async () => {
      const checkbox = wrapper.find(
        "#file-list tbody input[type='checkbox']:not([disabled])",
      );

      await checkbox.trigger("click");
      expect(checkToggle.element.indeterminate).toBeTruthy();
      expect(checkToggleLabel.text()).toBe(`Selected 1`);

      await checkToggle.trigger("click");
      expect(checkToggleLabel.text()).toBe(`Selected ${numAvailableFiles}`);

      await checkToggle.trigger("click");
      expect(checkToggleLabel.text()).toBe(`None Selected`);

      await checkToggle.trigger("click");
      expect(checkToggleLabel.text()).toBe(`Selected ${numAvailableFiles}`);
    });
  });
});
