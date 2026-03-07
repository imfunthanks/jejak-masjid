const postgres = require('postgres');
const testDb = async (url) => {
    const sql = postgres(url);
    try {
        await sql`SELECT 1`;
        console.log(`Success: ${url}`);
        return true;
    } catch (e) {
        console.log(`Failed: ${url} - ${e.message}`);
        return false;
    } finally {
        sql.end();
    }
};

(async () => {
    await testDb('postgresql://postgres.kcjcwymikyljwgnszewg:stTP9xKMclGEBbsb@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true');
    await testDb('postgresql://postgres.kcjcwymikyljwgnszewg:stTP9xKMclGEBbsb@aws-0-ap-southeast-3.pooler.supabase.com:6543/postgres?pgbouncer=true');
})();
