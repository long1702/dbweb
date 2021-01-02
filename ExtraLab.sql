/*1*/

CREATE TABLE [dbo].[fudgemart_agents](
	agent_id int not null primary key identity(1,1),
	agent_name varchar(50),
	agent_address varchar(50),
	agent_country varchar(2),
	agent_created_date datetime,
	CONSTRAINT agent_created_date CHECK (agent_created_date <= GetDate() ),
	agent_manager_id int not null foreign key references [fudgemart_employees](employee_id),
	agent_status bit not null default 1
);
CREATE INDEX idx_agent_country
   ON [dbo].[fudgemart_agents] ( agent_country );

/*3a*/
SELECT *
FROM [dbo].[fudgemart_employees]
WHERE [employee_department] = 'Electronics' AND (YEAR(GETDATE()) - YEAR(employee_birthdate)) > 30;

/*3b*/
SELECT *
FROM [dbo].[fudgemart_products]
WHERE [product_is_active] = 1 AND [product_wholesale_price] = [product_retail_price] / 2;

/*4a*/
CREATE VIEW v_fudgemart_active_product
AS
	SELECT * 
	FROM [fudgemart_products] JOIN [fudgemart_vendors] on [product_vendor_id] = [vendor_id]
	WHERE [product_is_active] = 1 AND [vendor_name] = 'Mikey';

SELECT * FROM v_fudgemart_active_product;

/*4b*/
CREATE VIEW v_fudgemart_payroll
AS
	SELECT timesheet_employee_id, COUNT(*) AS payroll_times
	FROM   dbo.fudgemart_employee_timesheets
	WHERE  (timesheet_hours < 40)
	GROUP BY timesheet_employee_id
	HAVING (COUNT(*) > 2);

SELECT * FROM v_fudgemart_payroll;

/*5a*/

CREATE PROCEDURE p_fudgemart_add_new_vendor 
	@vendor_id int,
	@vendor_name varchar(50),
	@vendor_phone varchar(20),
	@vendor_website varchar(1000)
AS
BEGIN
	SET NOCOUNT ON;
	IF EXISTS (SELECT * FROM [fudgemart_vendors] WHERE vendor_id = @vendor_id)
		BEGIN
			PRINT N'The vendor id has already existed in the database'
			RETURN 0
		END
	IF EXISTS (SELECT * FROM [fudgemart_vendors] WHERE vendor_name = @vendor_name)
		BEGIN
			PRINT N'The vendor name has already existed in the database'
			RETURN 0
		END
	INSERT INTO [fudgemart_vendors] (
		vendor_id, vendor_name, vendor_phone, vendor_website
	) VALUES (
		@vendor_id, @vendor_name, @vendor_phone, @vendor_website
	)
	RETURN @@ROWCOUNT
END

/*5b*/
exec p_fudgemart_add_new_vendor 21, 'Vinmart', '555-2222', 'www.vinmart.com';
exec p_fudgemart_add_new_vendor 22, 'Microsoft', '555-8888', 'www.microsoft.com';

SELECT * FROM [dbo].[fudgemart_vendors];

/*5c*/
CREATE PROCEDURE [dbo].[p_fudgemart_update_price_product]
	@product_id int, 
	@diff_price money, 
	@mode bit
AS
BEGIN
	IF @diff_price < 0 
		BEGIN
			PRINT N'The diff price must be greater than 0'
			RETURN 0
		END
	ELSE
		BEGIN
			IF @mode = 1
				BEGIN
				UPDATE [dbo].[fudgemart_products]
					SET product_retail_price = product_wholesale_price + @diff_price WHERE [product_id] = @product_id
				END
			ELSE
				BEGIN
				UPDATE [dbo].[fudgemart_products]
					SET product_wholesale_price = product_retail_price - @diff_price WHERE [product_id] = @product_id
				END
		END
END

EXEC p_fudgemart_update_price_product 3, 4, 1;
EXEC p_fudgemart_update_price_product 9, 2, 0;
SELECT * FROM [fudgemart_products];

/*5d*/
CREATE TRIGGER trg_insert_agent
ON [dbo].[fudgemart_agents]
AFTER INSERT
AS 
BEGIN
	SET NOCOUNT ON;
	IF (SELECT [agent_country] FROM inserted) IS NULL
		UPDATE [fudgemart_agents] SET agent_country='VN' WHERE fudgemart_agents.agent_id = (SELECT [agent_id] FROM inserted);
	ELSE
		IF NOT EXISTS (SELECT * FROM [country], inserted WHERE country.abbreviation = inserted.agent_country)
			INSERT INTO [country] (abbreviation, name) VALUES ((SELECT [agent_country] FROM inserted), NULL);
	IF (SELECT agent_created_date FROM inserted) IS NULL
		UPDATE [fudgemart_agents] SET agent_created_date=GETDATE() WHERE fudgemart_agents.agent_id = (SELECT [agent_id] FROM inserted)
END

INSERT INTO [fudgemart_agents] (agent_name, agent_address, agent_manager_id, agent_status) VALUES ('Tiki', '666 Wall Street', 1,1);
SELECT * FROM [fudgemart_agents];

/*6a*/
CREATE FUNCTION f_fudgemart_vendor_product_count
 ( @vendor_id INT )
 
 RETURNS INT
 
 AS
 
 BEGIN
 
 DECLARE @num_vendor INT;
 set @num_vendor = (select count(*) from fudgemart_products join fudgemart_vendors on product_vendor_id=vendor_id
						where product_vendor_id=@vendor_id)
 --DECLARE @pro_name VARCHAR(50);
 --DECLARE @pro_depart VARCHAR(20);
 --DECLARE @pro_id INT;
 --IF @num_vendor > 0
 --BEGIN
	--SELECT @pro_name = product_name
	--FROM  fudgemart_products
	--WHERE fudgemart_products.product_vendor_id = @vendor_id
	--GROUP BY fudgemart_products.product_department
 --END
 --PRINT @pro_name
 RETURN  @num_vendor
 
 END;
PRINT [dbo].f_fudgemart_vendor_product_count(2)

/*6b*/
SELECT fudgemart_vendors.vendor_id, fudgemart_vendors.vendor_name, 
dbo.f_fudgemart_vendor_product_count(fudgemart_vendors.vendor_id) AS vendor_pro_count
FROM fudgemart_vendors

/*6c*/
CREATE FUNCTION f_fudgemart_employees_sum_salary
 ( @frome_date datetime, @to_date datetime )

 RETURNS money
 AS
 BEGIN
  DECLARE @total_money money;

  SET @total_money = (SELECT )
  RETURN @total_money;
 END
 
CREATE FUNCTION dbo.f_fudgemart_employees_sum_salary(@from_date DATETIME, @to_date DATETIME)
RETURNS MONEY
AS
BEGIN
    DECLARE @payed MONEY;
    SET @payed = (SELECT SUM(employee_hourlywage*sum_hours) FROM fudgemart_employees 
							JOIN ( SELECT timesheet_employee_id AS employee_id, SUM(timesheet_hours) AS sum_hours 
                                FROM fudgemart_employee_timesheets 
                                WHERE DATEDIFF(DAY, timesheet_payrolldate, @from_date) <= 0 
                                AND DATEDIFF(DAY, timesheet_payrolldate, @to_date) >= 0  
                                GROUP BY timesheet_employee_id) AS hours_works
                                ON fudgemart_employees.employee_id = hours_works.employee_id);
    RETURN @payed;
END
GO
