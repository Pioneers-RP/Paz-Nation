# Modules

## Country

Une country est le pays géré par un joueur Discord

### Model
    - id
    - playerId (Discord)
    - name
    - channelId (Discord)
    - flag
    - devise
    - regime
    - ideology
    - rank
    - cash
    - pweeter
    - days
    - daily
    - holiday

### Controller
    - Update('Flag, Devise, Regime, Ideology, Pweeter')
    - Today()
    - IncreaseRank()


## Resources

ex : Bois, Acier, Eau, Métaux, Pétrole, Nourriture, ...

### Model
    - id
    - CountryId
    - Name
    - Quantity

### Controller
    - Buy
    - Sell
    - Add
    - Remove

## Army

## Population

## Diplomaty

## Territory

##
