import { mount } from "@vue/test-utils";
import FileDownloader, { STATUS, SAMPLE_DATA } from "./FileDownloader.vue";

//only available files can be selected
const numFiles = SAMPLE_DATA.length;

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

    test(`* Only those that have a status of "available" are currently able to be downloaded.`, async () => {
      window.alert = function () {};
      const alertSpy = vi.spyOn(window, "alert");
      const checkToggle = wrapper.find(`#check-toggle`);
      // Select all items
      await checkToggle.trigger("click");
      await button.trigger("submit");
      expect(alertSpy).toHaveBeenCalledTimes(1);
      for (let file of SAMPLE_DATA) {
        if (file.status === STATUS.available) {
          expect(alertSpy.mock.calls[0][0]).toMatch(
            `${file.device}:${file.path}`,
          );
        } else {
          expect(alertSpy.mock.calls[0][0]).not.toMatch(
            `${file.device}:${file.path}`,
          );
        }
      }
    });

    test(`There is a special message alerted when no files are available to download`, async () => {
      window.alert = function () {};
      const alertSpy = vi.spyOn(window, "alert");
      await button.trigger("submit");
      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(alertSpy.mock.calls[0][0]).toEqual(
        "No files available to download",
      );
    });

    test(`* Clicking "Download Selected" when some or all items are displayed should generate an alert box with the path and device of all selected files.`, async () => {
      window.alert = function () {};
      const alertSpy = vi.spyOn(window, "alert");
      const checkToggle = wrapper.find(`#check-toggle`);
      await checkToggle.trigger("click");
      await button.trigger("submit");
      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(alertSpy.mock.calls[0][0]).toMatch(
        `${SAMPLE_DATA[1].device}:${SAMPLE_DATA[1].path}`,
      );
      expect(alertSpy.mock.calls[0][0]).toMatch(
        `${SAMPLE_DATA[2].device}:${SAMPLE_DATA[2].path}`,
      );
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
      const checkboxes = wrapper.findAll(
        "#file-list tbody input[type='checkbox']",
      );

      for (let b of checkboxes) {
        await b.trigger("click");
      }
      expect(checkToggle.element.checked).toBeTruthy();
    });

    test("* The select-all checkbox should be in an indeterminate state if some but not all items are selected.", async () => {
      const checkboxes = wrapper.findAll(
        "#file-list tbody input[type='checkbox']",
      );
      await checkboxes[1].trigger("click");
      expect(checkToggle.element.indeterminate).toBeTruthy();
      expect(checkToggleLabel.text()).toBe(`Selected 1`);
    });

    test(`* The "Selected 2" text should reflect the count of selected items and display "None Selected" when there are none selected.`, async () => {
      expect(checkToggleLabel.text()).toBe("None Selected");
      await checkToggle.trigger("click");
      expect(checkToggleLabel.text()).toBe(`Selected ${numFiles}`);
    });

    test("* Clicking the select-all checkbox should de-select all items if all are currently selected.", async () => {
      await checkToggle.trigger("click");
      await checkToggle.trigger("click");
      expect(checkToggleLabel.text()).toBe("None Selected");
    });

    test("* Clicking the select-all checkbox should select all items if none or some are selected.", async () => {
      const checkboxes = wrapper.findAll(
        "#file-list tbody input[type='checkbox']",
      );

      await checkboxes[1].trigger("click");
      expect(checkToggle.element.indeterminate).toBeTruthy();
      expect(checkToggleLabel.text()).toBe(`Selected 1`);

      await checkToggle.trigger("click");
      expect(checkToggleLabel.text()).toBe(`Selected ${numFiles}`);

      await checkToggle.trigger("click");
      expect(checkToggleLabel.text()).toBe(`None Selected`);

      await checkToggle.trigger("click");
      expect(checkToggleLabel.text()).toBe(`Selected ${numFiles}`);
    });
  });
});
