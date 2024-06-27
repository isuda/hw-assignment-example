<script>
  export const STATUS = {
    available: 'available',
    scheduled: 'scheduled'
  }

  export const SAMPLE_DATA = [
    {name: 'smss.exe', device: 'Mario', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe', status: 'scheduled'},
    {name: 'netsh.exe', device: 'Luigi', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe', status: 'available'},
    {name: 'uxtheme.dll', device: 'Peach', path: '\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll', status: 'available'},
    {name: 'aries.sys', device: 'Daisy', path: '\\Device\\HarddiskVolume1\\Windows\\System32\\aries.sys', status: 'scheduled'},
    {name: 'cryptbase.dll', device: 'Yoshi', path: '\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll', status: 'scheduled'},
    {name: '7za.exe', device: 'Toad', path: '\\Device\\HarddiskVolume1\\temp\\7za.exe', status: 'scheduled'}
  ];

  export default {
    name: "FileDownloader",
    methods: {
      downloadFiles() {
        const selectedFiles = this.$refs.fileCheckboxes
          .filter(c => c.checked)
          .map(c => this.files[c.value])
          .filter(c => c.status === STATUS.available);

        if (selectedFiles.length > 0) {
          alert(`Downloading:\n${selectedFiles.map(f => `${f.device}:${f.path}`).join("\n")}`);
        } else {
          alert("No files available to download");
        }
      },
      fileClicked() {
        this.updateCheckboxState();
      },
      updateCheckboxState() {
        this.numSelected = this.$refs.fileCheckboxes.filter(c => c.checked).length;
        if (this.numSelected === 0) {
          this.$refs.checkToggle.indeterminate = false;
          this.$refs.checkToggle.checked = false;
        } else if (this.numSelected === this.files.length) {
          this.$refs.checkToggle.indeterminate = false;
          this.$refs.checkToggle.checked = true;
        } else {
          this.$refs.checkToggle.indeterminate = true;
        }
      },
      toggleChecked() {
        if (this.numSelected === this.files.length) {
          this.$refs.fileCheckboxes.forEach(c => c.checked = false);
          this.$refs.checkToggle.indeterminate = false;
          this.$refs.checkToggle.checked = false;
          this.numSelected = 0;
        } else {
          this.$refs.fileCheckboxes.forEach(c => c.checked = true);
          this.$refs.checkToggle.indeterminate = false;
          this.$refs.checkToggle.checked = true;
          this.numSelected = this.files.length;
        }
      }
    },
    computed: {
      noSelectedFiles() {
        return this.numSelected === 0;
      },
      numSelectedLabel() {
        if (this.noSelectedFiles) {
          return "None Selected"
        } else {
          return `Selected ${this.numSelected}`
        }
      }
    },
    data() {
      return {
        numSelected: 0,
        files: SAMPLE_DATA
      }
    }
  }
</script>

<template>
  <form @submit.prevent="downloadFiles">
    <table id="file-list" class="file-list">
      <thead>
        <tr>
          <th class="action-bar" colspan="5">
            <span class="select-controls">
              <input id="check-toggle" ref="checkToggle" @click="toggleChecked" type="checkbox"> <label class="selected-label" for="check-toggle">{{ numSelectedLabel }}</label>
            </span>
            <button id="download-button" class="download-button" type="submit" aria-label="Download selected files">
              <span class="download-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m8 12 4 4 4-4"/>
                  <path stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5" d="M12 16V4m7 13v.6c0 1.33-1.07 2.4-2.4 2.4H7.4C6.07 20 5 18.93 5 17.6V17"/>
                </svg>
              </span>Download Selected
            </button>
          </th>
        </tr>
        <tr>
          <th class="col-checkbox"></th>
          <th class="col-name">Name</th>
          <th class="col-device">Device</th>
          <th class="col-path">Path</th>
          <th class="col-status">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(file, index) in files">
          <td><input type="checkbox" ref="fileCheckboxes" class="select-file-checkbox" @click="fileClicked" :value="index" aria-label="Select file"></td>
          <td>{{ file.name }}</td>
          <td>{{ file.device }}</td>
          <td>{{ file.path }}</td>
          <td class="file-status" :class="file.status">{{ file.status }}</td>
        </tr>
      </tbody>
    </table>
  </form>
</template>

<style>
:root {
  --table-border-color: lightgray;
  --table-row-selected: #EEEEEE;
  --table-row-hover: whitesmoke;
  --status-available: #96CC55;
  --spacing: 1em;
  --spacing-small: 0.7em;

  --font-color-normal: black;
}

input[type="checkbox"]:not(:disabled) {
  cursor:pointer;
}

body {
  color: var(--font-color-normal);
}

table.file-list {
  border-collapse: collapse;
  width: 100%;
  border: 1px solid var(--table-border-color);
}

.selected-label {
  font-size: 1.3em;
  margin-left: var(--spacing);
}

.download-button {
  background: transparent;
  border: none;
  font-size: 1.3em;
}

.download-icon {
  display: inline-block;
  width: 1.8em;
  position: relative;
  top: 0.35em;
}

.download-icon > svg {
  stroke: var(--font-color-normal);
}

.select-controls {
  display:inline-block;
  width: 12.5em;
}

.col-checkbox {
  width: 6%;
}
.col-name {
  width: 16%;
}
.col-device {
  width: 16%;
}
.col-path {
  width: 51.5%;
}

.file-list input[type=checkbox] {
    transform: scale(1.2);
}

.file-list th, td {
  font-size: 0.7em;
  text-align: left;
  padding: var(--spacing-small);
  border-bottom: 1px solid var(--table-border-color);
}

.file-list th {
  font-size: 0.8em;
  font-weight: normal;
  padding: var(--spacing) var(--spacing-small);
  border-top: 1px solid var(--table-border-color);
}

.file-list th.action-bar {
  padding: 0 var(--spacing-small) var(--spacing);
}

.file-list tr:hover {
  background:var(--table-row-hover);
}

.file-list tbody tr:has(input:checked) {
  background:var(--table-row-selected);
}

.file-status {
  text-transform: capitalize;
  position:relative;
}

.file-status::before {
  content: "";
  position:absolute;
  display:block;
  top: 50%;
  left: calc(0px - var(--spacing));
  transform: translateY(-50%);
  width:1.2em;
  height:1.2em;
}

.file-status.available::before {
  border-radius: 50%;
  background-color: var(--status-available);
}

</style>
