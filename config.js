module.exports = _dev();

function _dev() {
    return {
		databaseConnectionString: "mongodb://nodejitsu_chrisharrington:5bujcm5jeineb9iqhdvddn19ho@ds061518.mongolab.com:61518/nodejitsu_chrisharrington_nodejitsudb9974367446"
    }
}

function _prod() {
    return {
        dataConnectionString: "Server=tcp:xqb8ocmj94.database.windows.net,1433;Database=Development;User ID=IssueTrackerApp@xqb8ocmj94;Password=20AEBDBF-90A4-444B-B1C6-B2C53CB5AD37;Trusted_Connection=False;Encrypt=True;Connection Timeout=30;MultipleActiveResultSets=true;"
    }
}