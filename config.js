exports.config = _dev();

function _dev() {
    return {
        dataConnectionString: "Server=tcp:xqb8ocmj94.database.windows.net,1433;Database=Development;User ID=IssueTrackerApp@xqb8ocmj94;Password=20AEBDBF-90A4-444B-B1C6-B2C53CB5AD37;Trusted_Connection=False;Encrypt=True;Connection Timeout=30;MultipleActiveResultSets=true;"
    }
}

function _prod() {
    return {
        dataConnectionString: "Server=tcp:xqb8ocmj94.database.windows.net,1433;Database=Development;User ID=IssueTrackerApp@xqb8ocmj94;Password=20AEBDBF-90A4-444B-B1C6-B2C53CB5AD37;Trusted_Connection=False;Encrypt=True;Connection Timeout=30;MultipleActiveResultSets=true;"
    }
}