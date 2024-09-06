module.exports = async function () {
    this.before('CREATE', 'Files', req => {
        console.log('Create called');
        console.log(JSON.stringify(req.data));
        req.data.url = `/odata/v4/attachments/Files(${req.data.ID})/content`;
    });

    this.before('READ', 'Files', req => {
        console.log('content-type: ', req.headers['content-type']);
    });

    this.before('CREATE', 'Book', req => {
        // Logic for Employee creation
        console.log('Book creation request');
    });
};
