# Backend


Database
#Create migration
npx sequelize-cli migration:generate  --name create-user

Execute:
npx sequelize-cli db:migrate --url 'postgres://mymoney:mymoney@docker:5432/mymoney'