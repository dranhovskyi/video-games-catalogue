IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'VideoGamesCatalogDb')
BEGIN
    CREATE DATABASE VideoGamesCatalogDb;
    PRINT 'Database VideoGamesCatalogDb created.';
END
ELSE
BEGIN
    PRINT 'Database VideoGamesCatalogDb already exists.';
END
GO

USE VideoGamesCatalogDb;
GO

-- Check if table exists, if not EF Core will create it
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[VideoGames]') AND type in (N'U'))
BEGIN
    PRINT 'VideoGames table does not exist. EF Core will create it.';
END
ELSE
BEGIN
    PRINT 'VideoGames table already exists.';
END
GO