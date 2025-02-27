sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Item",
    "sap/m/MessageToast"
],
    function (Controller, JSONModel, Item, MessageToast) {
        "use strict";

        return Controller.extend("sumanth.attachments.controller.App", {
            onInit: function () {
                // Initialize model for Book data
                var oBookModel = new JSONModel({
                    book_id: "",
                    book_name: "",
                    price: "",
                });
                this.getView().setModel(oBookModel, "BookModel");
            },

            onAfterItemAdded: function (oEvent) {
                var item = oEvent.getParameter("item");
                this._createEntity(item)
                    .then((id) => {
                        this._uploadContent(item, id);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },

            onUploadCompleted: function (oEvent) {
                var oUploadSet = this.byId("BookUploadSet");  // Make sure to reference the correct ID
                oUploadSet.removeAllIncompleteItems();            // Clear incomplete items

                var oBinding = oUploadSet.getBinding("items");
                if (oBinding) {
                    oBinding.refresh();
                } else {
                    console.warn("Binding for 'items' not found.");
                }
            },

            onRemovePressed: function (oEvent) {
                oEvent.preventDefault();
                oEvent.getParameter("item").getBindingContext().delete();
                MessageToast.show("Selected file has been deleted");
            },

            onOpenPressed: function (oEvent) {
                oEvent.preventDefault();
                var item = oEvent.getSource();
                this._fileName = item.getFileName();
                var that = this;
                this._download(item)
                    .then((blob) => {
                        var url = window.URL.createObjectURL(blob);
                        var link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', that._fileName);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },

            _download: function (item) {
                var settings = {
                    url: item.getUrl(),
                    method: "GET",
                    headers: {
                        "Content-type": "application/octet-stream"
                    },
                    xhrFields: {
                        responseType: 'blob'
                    }
                };

                return new Promise((resolve, reject) => {
                    $.ajax(settings)
                        .done((result) => {
                            resolve(result);
                        })
                        .fail((err) => {
                            reject(err);
                        });
                });
            },

            _createEntity: function (item) {
                var data = {
                    mediaType: item.getMediaType(),
                    fileName: item.getFileName(),
                    size: item.getFileObject().size
                };

                var settings = {
                    url: "/odata/v4/attachments/Files",
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    data: JSON.stringify(data)
                };

                return new Promise((resolve, reject) => {
                    $.ajax(settings)
                        .done((results) => {
                            resolve(results.ID);
                        })
                        .fail((err) => {
                            reject(err);
                        });
                });
            },

            _uploadContent: function (item, id) {
                var url = `/odata/v4/attachments/Files(${id})/content`;
                item.setUploadUrl(url);
                var oUploadSet = this.byId("BookUploadSet");
                oUploadSet.setHttpRequestMethod("PUT");
                oUploadSet.uploadItem(item);
            },

            // Formatter for file thumbnails
            formatThumbnailUrl: function (mediaType) {
                var iconUrl;
                switch (mediaType) {
                    case "image/png":
                        iconUrl = "sap-icon://card";
                        break;
                    case "text/plain":
                        iconUrl = "sap-icon://document-text";
                        break;
                    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                        iconUrl = "sap-icon://excel-attachment";
                        break;
                    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                        iconUrl = "sap-icon://doc-attachment";
                        break;
                    case "application/pdf":
                        iconUrl = "sap-icon://pdf-attachment";
                        break;
                    default:
                        iconUrl = "sap-icon://attachment";
                }
                return iconUrl;
            },

            onBookSave: function () {
                var oModel = this.getView().getModel("BookModel");
                var oData = oModel.getData();
                var sUrl = "/odata/v4/attachments/Book";

                // Save Book data using AJAX
                $.ajax({
                    url: sUrl,
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(oData),
                    success: function () {
                        MessageToast.show("Book saved successfully!");
                    },
                    error: function () {
                        MessageToast.show("Failed to save Book!");
                    }
                });
            }
        });
    });
